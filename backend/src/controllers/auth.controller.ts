import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/token.util';
import { sendSuccess, sendError } from '../utils/response.util';
import { Role, EmploymentStatus, PerformanceRating } from '@prisma/client';

/**
 * Controller for User Authentication & Profile Management
 */
export class AuthController {
  /**
   * Register a new User and create associated Employee profile.
   * Also initialises Leave Balances and a default Payroll Structure.
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        email,
        password,
        role = 'EMPLOYEE',
        employeeCode,
        firstName,
        lastName,
        phone,
        personalEmail,
        address,
        designation = 'Staff Member',
        departmentId,
        departmentCode = 'ENG',
        basicSalary = 50000,
      } = req.body;

      // ─── Basic Validation ────────────────────────────────────────────────
      if (!email || !password || !firstName || !lastName) {
        return sendError(res, 'Email, password, firstName, and lastName are required', 400);
      }

      // ─── Duplicate Check ─────────────────────────────────────────────────
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return sendError(res, 'A user with this email already exists', 409);
      }

      // ─── Resolve Department ──────────────────────────────────────────────
      let targetDeptId = departmentId;
      if (!targetDeptId) {
        const dept = await prisma.department.findFirst({ where: { code: departmentCode } });
        if (dept) {
          targetDeptId = dept.id;
        } else {
          // Create a default department if none exists
          const newDept = await prisma.department.create({
            data: {
              name: 'Core Engineering',
              code: 'ENG',
              unitName: 'Engineering Unit',
              budget: 500000,
            },
          });
          targetDeptId = newDept.id;
        }
      }

      // ─── Hash Password ───────────────────────────────────────────────────
      const hashedPassword = await hashPassword(password);

      // ─── Generate Employee Code if not supplied ───────────────────────────
      const generatedCode = employeeCode || `EMP-${Date.now()}`;

      // ─── Transactional Creation ───────────────────────────────────────────
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create User account
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            role: role as Role,
            isVerified: true,
          },
        });

        // 2. Create Employee Profile
        const employee = await tx.employee.create({
          data: {
            userId: user.id,
            employeeCode: generatedCode,
            firstName,
            lastName,
            phone,
            personalEmail: personalEmail || email,
            address,
            designation,
            departmentId: targetDeptId,
            joiningDate: new Date(),
            status: EmploymentStatus.ACTIVE,
            performanceRating: PerformanceRating.GOOD,
          },
          include: { department: true },
        });

        // 3. Initialise Leave Balances for all leave types
        const leaveTypes = await tx.leaveType.findMany();
        for (const lt of leaveTypes) {
          await tx.leaveBalance.create({
            data: {
              employeeId: employee.id,
              leaveTypeId: lt.id,
              totalAllocated: lt.defaultDays,
              used: 0,
              remaining: lt.defaultDays,
            },
          });
        }

        // 4. Initialise Default Payroll Structure
        const hra         = basicSalary * 0.4;
        const special     = basicSalary * 0.2;
        const pf          = basicSalary * 0.12;
        const pt          = 200;
        const med         = 1000;
        const gross       = basicSalary + hra + special;
        const deductions  = pf + pt + med;
        const net         = gross - deductions;

        await tx.payrollStructure.create({
          data: {
            employeeId: employee.id,
            basicSalary,
            hraAllowance: hra,
            specialAllowance: special,
            providentFund: pf,
            professionalTax: pt,
            medicalInsurance: med,
            grossSalary: gross,
            totalDeductions: deductions,
            netSalary: net,
          },
        });

        return { user, employee };
      });

      // ─── Generate JWT ─────────────────────────────────────────────────────
      const token = generateToken({
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        employeeId: result.employee.id,
      });

      return sendSuccess(
        res,
        {
          token,
          user: {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
            employee: result.employee,
          },
        },
        'User and employee registered successfully',
        201
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Login with Email & Password — returns signed JWT.
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 'Email and password are required', 400);
      }

      // ─── Find User ────────────────────────────────────────────────────────
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          employee: {
            include: { department: true },
          },
        },
      });

      if (!user) {
        return sendError(res, 'Invalid email or password credentials', 401);
      }

      // ─── Verify Password ──────────────────────────────────────────────────
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return sendError(res, 'Invalid email or password credentials', 401);
      }

      // ─── Generate JWT ─────────────────────────────────────────────────────
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employee?.id,
      });

      return sendSuccess(
        res,
        {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            employee: user.employee,
          },
        },
        'Login successful'
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get currently authenticated user's full profile.
   */
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError(res, 'Unauthorized', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          employee: {
            include: {
              department: true,
              leaveBalances: { include: { leaveType: true } },
              payrollStructure: true,
              documents: true,
            },
          },
        },
      });

      if (!user) {
        return sendError(res, 'User not found', 404);
      }

      return sendSuccess(res, user, 'User profile fetched successfully');
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update Employee Profile.
   * Employees can only update their own contact info & avatar.
   * Admins / HR Officers can update all fields.
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.employeeId) {
        return sendError(res, 'Employee profile not associated with user', 400);
      }

      const { employeeId } = req.params;
      const targetId = employeeId || req.user.employeeId;

      // ─── Permission Guard ─────────────────────────────────────────────────
      if (req.user.role === 'EMPLOYEE' && targetId !== req.user.employeeId) {
        return sendError(res, 'Forbidden: You can only edit your own profile', 403);
      }

      const {
        phone,
        personalEmail,
        address,
        avatarUrl,
        // Admin-only fields below:
        firstName,
        lastName,
        designation,
        departmentId,
        status,
        performanceRating,
      } = req.body;

      const updateData: any = {};

      // Fields any employee can update
      if (phone !== undefined)         updateData.phone = phone;
      if (personalEmail !== undefined) updateData.personalEmail = personalEmail;
      if (address !== undefined)       updateData.address = address;
      if (avatarUrl !== undefined)     updateData.avatarUrl = avatarUrl;

      // Admin / HR Officer exclusive fields
      if (req.user.role === 'ADMIN' || req.user.role === 'HR_OFFICER') {
        if (firstName)        updateData.firstName = firstName;
        if (lastName)         updateData.lastName = lastName;
        if (designation)      updateData.designation = designation;
        if (departmentId)     updateData.departmentId = departmentId;
        if (status)           updateData.status = status;
        if (performanceRating) updateData.performanceRating = performanceRating;
      }

      const updated = await prisma.employee.update({
        where: { id: targetId },
        data: updateData,
        include: { department: true },
      });

      return sendSuccess(res, updated, 'Profile updated successfully');
    } catch (error: any) {
      next(error);
    }
  }
}
