import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config';
import { sendSuccess, sendError } from '../utils/response.util';

/**
 * Controller for Payroll & Compensation Management
 */
export class PayrollController {
  /**
   * Get the authenticated employee's personal salary slip / structure.
   * Returns a clean itemised breakdown ready for the frontend payslip card.
   */
  static async getMySalary(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.employeeId) {
        return sendError(res, 'No employee record found', 400);
      }

      const payroll = await prisma.payrollStructure.findUnique({
        where:   { employeeId: req.user.employeeId },
        include: {
          employee: {
            include: { department: true },
          },
        },
      });

      if (!payroll) {
        return sendError(res, 'Payroll record not initialized', 404);
      }

      // ─── Build Formatted Payslip Object ───────────────────────────────────
      const payslip = {
        employee: {
          name:        `${payroll.employee.firstName} ${payroll.employee.lastName}`,
          code:        payroll.employee.employeeCode,
          designation: payroll.employee.designation,
          department:  payroll.employee.department.name,
        },
        earnings: [
          { component: 'Basic Salary',                amount: payroll.basicSalary },
          { component: 'House Rent Allowance (HRA)',  amount: payroll.hraAllowance },
          { component: 'Special Allowance',           amount: payroll.specialAllowance },
        ],
        deductions: [
          { component: 'Provident Fund (PF)',  amount: payroll.providentFund },
          { component: 'Professional Tax (PT)', amount: payroll.professionalTax },
          { component: 'Medical Insurance',    amount: payroll.medicalInsurance },
        ],
        grossSalary:     payroll.grossSalary,
        totalDeductions: payroll.totalDeductions,
        netSalary:       payroll.netSalary,
        currency:        'USD',
        payCycle:        'Monthly',
      };

      return sendSuccess(res, payslip, 'My payslip structure fetched successfully');
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get all payroll structures across the company (Admin / HR only).
   * Returns aggregate metrics: total payroll cost, avg salary, total net payout.
   * Supports ?departmentId= filter.
   */
  static async getAllStructures(req: Request, res: Response, next: NextFunction) {
    try {
      const { departmentId } = req.query;

      const whereClause: any = {};
      if (departmentId) whereClause.employee = { departmentId: departmentId as string };

      const structures = await prisma.payrollStructure.findMany({
        where:   whereClause,
        include: {
          employee: {
            include: { department: true },
          },
        },
        orderBy: { netSalary: 'desc' },
      });

      // ─── Aggregate Metrics ─────────────────────────────────────────────────
      const totalPayrollCost = structures.reduce((sum, s) => sum + s.grossSalary, 0);
      const totalNetPayout   = structures.reduce((sum, s) => sum + s.netSalary,   0);
      const avgNetSalary     = structures.length > 0 ? Math.round(totalNetPayout / structures.length) : 0;

      return sendSuccess(
        res,
        {
          summary: {
            totalEmployees: structures.length,
            totalPayrollCost,
            totalNetPayout,
            avgNetSalary,
          },
          items: structures,
        },
        'All payroll structures fetched successfully'
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update an employee's salary structure (Admin / HR only).
   * Auto-recalculates Gross, Deductions, and Net Pay.
   * Logs change to the Audit Trail.
   */
  static async updateStructure(req: Request, res: Response, next: NextFunction) {
    try {
      const { employeeId } = req.params;
      const {
        basicSalary,
        hraAllowance,
        specialAllowance,
        providentFund,
        professionalTax,
        medicalInsurance,
      } = req.body;

      const existing = await prisma.payrollStructure.findUnique({ where: { employeeId } });
      if (!existing) {
        return sendError(res, 'Payroll structure not found for employee', 404);
      }

      // Use provided values or fall back to existing values
      const newBasic   = basicSalary       !== undefined ? Number(basicSalary)       : existing.basicSalary;
      const newHra     = hraAllowance      !== undefined ? Number(hraAllowance)      : existing.hraAllowance;
      const newSpecial = specialAllowance  !== undefined ? Number(specialAllowance)  : existing.specialAllowance;
      const newPf      = providentFund     !== undefined ? Number(providentFund)     : existing.providentFund;
      const newPt      = professionalTax   !== undefined ? Number(professionalTax)   : existing.professionalTax;
      const newMed     = medicalInsurance  !== undefined ? Number(medicalInsurance)  : existing.medicalInsurance;

      // Recalculate derived fields
      const grossSalary    = newBasic + newHra + newSpecial;
      const totalDeductions = newPf + newPt + newMed;
      const netSalary       = grossSalary - totalDeductions;

      const updated = await prisma.payrollStructure.update({
        where: { employeeId },
        data: {
          basicSalary:      newBasic,
          hraAllowance:     newHra,
          specialAllowance: newSpecial,
          providentFund:    newPf,
          professionalTax:  newPt,
          medicalInsurance: newMed,
          grossSalary,
          totalDeductions,
          netSalary,
        },
      });

      // ─── Audit Trail ──────────────────────────────────────────────────────
      await prisma.auditLog.create({
        data: {
          action:        'UPDATE_SALARY_STRUCTURE',
          entity:        'PayrollStructure',
          entityId:      updated.id,
          performedById: req.user?.userId || 'SYSTEM',
          details:       JSON.stringify({
            employeeId,
            previousNet: existing.netSalary,
            newNet:      netSalary,
          }),
        },
      });

      return sendSuccess(res, updated, 'Salary structure updated successfully');
    } catch (error: any) {
      next(error);
    }
  }
}
