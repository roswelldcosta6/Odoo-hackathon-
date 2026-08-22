import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config';
import { sendSuccess, sendError } from '../utils/response.util';
import { hashPassword } from '../utils/password.util';
import { EmploymentStatus, PerformanceRating, Role } from '@prisma/client';

/**
 * Controller for Employee Management & Directory
 */
export class EmployeeController {
  /**
   * List all employees with search, department filtering, and pagination.
   * Supports: ?search=, ?departmentId=, ?status=, ?performanceRating=, ?page=, ?limit=
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        search,
        departmentId,
        status,
        performanceRating,
        page  = '1',
        limit = '20',
      } = req.query;

      const pageNum = parseInt(page  as string, 10) || 1;
      const take    = parseInt(limit as string, 10) || 20;
      const skip    = (pageNum - 1) * take;

      const whereClause: any = {};

      if (departmentId)     whereClause.departmentId     = departmentId     as string;
      if (status)           whereClause.status           = status           as EmploymentStatus;
      if (performanceRating) whereClause.performanceRating = performanceRating as PerformanceRating;

      if (search) {
        const query = search as string;
        whereClause.OR = [
          { firstName:     { contains: query } },
          { lastName:      { contains: query } },
          { employeeCode:  { contains: query } },
          { designation:   { contains: query } },
          { personalEmail: { contains: query } },
          { user: { email: { contains: query } } },
        ];
      }

      const [total, employees] = await Promise.all([
        prisma.employee.count({ where: whereClause }),
        prisma.employee.findMany({
          where: whereClause,
          skip,
          take,
          include: {
            department:       true,
            user:             { select: { email: true, role: true, isVerified: true } },
            reportingManager: { select: { id: true, firstName: true, lastName: true, designation: true } },
            _count:           { select: { subordinates: true, attendances: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return sendSuccess(
        res,
        {
          items: employees,
          pagination: {
            total,
            page:       pageNum,
            limit:      take,
            totalPages: Math.ceil(total / take),
          },
        },
        'Employees fetched successfully'
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get a single employee's full detailed profile including leave balances,
   * payroll structure, documents, and recent attendance.
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          department:       true,
          user:             { select: { id: true, email: true, role: true } },
          reportingManager: { select: { id: true, firstName: true, lastName: true, designation: true } },
          subordinates:     { select: { id: true, firstName: true, lastName: true, designation: true, avatarUrl: true } },
          leaveBalances:    { include: { leaveType: true } },
          payrollStructure: true,
          documents:        true,
          attendances: {
            take: 10,
            orderBy: { workDate: 'desc' },
          },
        },
      });

      if (!employee) {
        return sendError(res, 'Employee not found', 404);
      }

      return sendSuccess(res, employee, 'Employee profile fetched successfully');
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Create a new Employee Profile & Login User (Admin / HR only).
   * Automatically creates the user account, leave balances, and payroll structure.
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        email,
        password         = 'Password@123',
        role             = 'EMPLOYEE',
        employeeCode,
        firstName,
        lastName,
        phone,
        personalEmail,
        address,
        designation,
        departmentId,
        joiningDate,
        basicSalary      = 60000,
        reportingManagerId,
      } = req.body;

      if (!email || !firstName || !lastName || !designation || !departmentId) {
        return sendError(res, 'Email, firstName, lastName, designation, and departmentId are required', 400);
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return sendError(res, 'A user with this email already exists', 409);
      }

      const hashedPassword = await hashPassword(password);
      const generatedCode  = employeeCode || `EMP-${Date.now()}`;

      const created = await prisma.$transaction(async (tx) => {
        // 1. Create user account
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            role: role as Role,
            isVerified: true,
          },
        });

        // 2. Create employee record
        const employee = await tx.employee.create({
          data: {
            userId:            user.id,
            employeeCode:      generatedCode,
            firstName,
            lastName,
            phone,
            personalEmail:     personalEmail || email,
            address,
            designation,
            departmentId,
            joiningDate:       joiningDate ? new Date(joiningDate) : new Date(),
            reportingManagerId,
            status:            EmploymentStatus.ACTIVE,
            performanceRating: PerformanceRating.GOOD,
          },
          include: { department: true },
        });

        // 3. Initialise leave balances
        const leaveTypes = await tx.leaveType.findMany();
        for (const lt of leaveTypes) {
          await tx.leaveBalance.create({
            data: {
              employeeId:     employee.id,
              leaveTypeId:    lt.id,
              totalAllocated: lt.defaultDays,
              used:           0,
              remaining:      lt.defaultDays,
            },
          });
        }

        // 4. Initialise payroll structure
        const hra        = basicSalary * 0.4;
        const special    = basicSalary * 0.2;
        const pf         = basicSalary * 0.12;
        const pt         = 200;
        const med        = 1000;
        const gross      = basicSalary + hra + special;
        const deductions = pf + pt + med;
        const net        = gross - deductions;

        await tx.payrollStructure.create({
          data: {
            employeeId:      employee.id,
            basicSalary,
            hraAllowance:    hra,
            specialAllowance: special,
            providentFund:   pf,
            professionalTax: pt,
            medicalInsurance: med,
            grossSalary:     gross,
            totalDeductions: deductions,
            netSalary:       net,
          },
        });

        return employee;
      });

      return sendSuccess(res, created, 'Employee created successfully', 201);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Upload a document for an employee (link via URL — e.g., Supabase Storage URL).
   */
  static async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, fileUrl, fileType = 'application/pdf' } = req.body;

      if (!title || !fileUrl) {
        return sendError(res, 'Document title and fileUrl are required', 400);
      }

      const doc = await prisma.employeeDocument.create({
        data: {
          employeeId: id,
          title,
          fileUrl,
          fileType,
        },
      });

      return sendSuccess(res, doc, 'Document uploaded successfully', 201);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * List all departments with employee head-count.
   */
  static async getDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await prisma.department.findMany({
        include: {
          _count: { select: { employees: true } },
        },
      });

      return sendSuccess(res, departments, 'Departments fetched successfully');
    } catch (error: any) {
      next(error);
    }
  }
}
