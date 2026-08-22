import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config';
import { sendSuccess, sendError } from '../utils/response.util';
import { LeaveStatus, AttendanceStatus } from '@prisma/client';

/**
 * Controller for Leave & Time-Off Management
 */
export class LeaveController {
  /**
   * Get leave balances for the authenticated employee.
   */
  static async getBalances(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.employeeId) {
        return sendError(res, 'No employee record found', 400);
      }

      const balances = await prisma.leaveBalance.findMany({
        where:   { employeeId: req.user.employeeId },
        include: { leaveType: true },
      });

      return sendSuccess(res, balances, 'Leave balances fetched successfully');
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Apply for leave.
   * - Automatically excludes weekends from total days.
   * - Validates remaining balance.
   * - Runs the Smart Collision Engine: warns if ≥2 teammates are on approved leave on overlapping dates.
   */
  static async apply(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.employeeId) {
        return sendError(res, 'No employee record found', 400);
      }

      const { leaveTypeId, startDate, endDate, reason } = req.body;

      if (!leaveTypeId || !startDate || !endDate || !reason) {
        return sendError(res, 'leaveTypeId, startDate, endDate, and reason are required', 400);
      }

      const start = new Date(startDate);
      const end   = new Date(endDate);

      if (start > end) {
        return sendError(res, 'startDate cannot be after endDate', 400);
      }

      // ─── Calculate Working Days (exclude weekends) ─────────────────────────
      let totalDays = 0;
      const cur = new Date(start);
      while (cur <= end) {
        const dayOfWeek = cur.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) totalDays++;
        cur.setDate(cur.getDate() + 1);
      }
      if (totalDays === 0) totalDays = 1; // Minimum 1 day

      // ─── Balance Check ─────────────────────────────────────────────────────
      const balance = await prisma.leaveBalance.findUnique({
        where: {
          employeeId_leaveTypeId: {
            employeeId:  req.user.employeeId,
            leaveTypeId,
          },
        },
        include: { leaveType: true },
      });

      if (!balance) {
        return sendError(res, 'Invalid leave type for this employee', 400);
      }

      // Unpaid Leave (UL) has no balance restriction
      if (balance.leaveType.code !== 'UL' && balance.remaining < totalDays) {
        return sendError(
          res,
          `Insufficient leave balance. You have ${balance.remaining} days remaining, but requested ${totalDays} days.`,
          400
        );
      }

      // ─── Smart Collision Engine ────────────────────────────────────────────
      // Count how many colleagues in the same department have APPROVED leave overlapping these dates
      const employee = await prisma.employee.findUnique({
        where:  { id: req.user.employeeId },
        select: { departmentId: true },
      });

      let departmentOverlapCount = 0;
      if (employee?.departmentId) {
        departmentOverlapCount = await prisma.leaveRequest.count({
          where: {
            status:   LeaveStatus.APPROVED,
            employee: { departmentId: employee.departmentId },
            OR:       [{ startDate: { lte: end }, endDate: { gte: start } }],
          },
        });
      }

      // ─── Create Leave Request ──────────────────────────────────────────────
      const newRequest = await prisma.leaveRequest.create({
        data: {
          employeeId: req.user.employeeId,
          leaveTypeId,
          startDate:  start,
          endDate:    end,
          totalDays,
          reason,
          status:     LeaveStatus.PENDING,
        },
        include: { leaveType: true },
      });

      return sendSuccess(
        res,
        {
          request: newRequest,
          smartInsights: {
            departmentOverlapCount,
            hasCollisionWarning: departmentOverlapCount >= 2,
            warningMessage:
              departmentOverlapCount >= 2
                ? `Note: ${departmentOverlapCount} team members in your department have approved leave during this time.`
                : null,
          },
        },
        'Leave application submitted successfully',
        201
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get the authenticated employee's own leave request history.
   */
  static async getMyRequests(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.employeeId) {
        return sendError(res, 'No employee record found', 400);
      }

      const requests = await prisma.leaveRequest.findMany({
        where:   { employeeId: req.user.employeeId },
        include: {
          leaveType:  true,
          reviewedBy: { select: { firstName: true, lastName: true, designation: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, requests, 'My leave requests fetched successfully');
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get all leave requests (Admin / HR).
   * Supports ?status= and ?departmentId= filters.
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, departmentId } = req.query;

      const whereClause: any = {};
      if (status)       whereClause.status   = status as LeaveStatus;
      if (departmentId) whereClause.employee = { departmentId: departmentId as string };

      const requests = await prisma.leaveRequest.findMany({
        where:   whereClause,
        include: {
          employee: {
            include: { department: true },
          },
          leaveType:  true,
          reviewedBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, requests, 'All leave requests fetched successfully');
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Approve or Reject a leave request (Admin / HR only).
   * On APPROVE:
   *   - Deducts leave balance.
   *   - Creates ON_LEAVE attendance records for each working day.
   *   - Logs to Audit Trail.
   */
  static async review(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, reviewerComment } = req.body;

      if (!status || ![LeaveStatus.APPROVED, LeaveStatus.REJECTED].includes(status)) {
        return sendError(res, 'Status must be APPROVED or REJECTED', 400);
      }

      const leaveReq = await prisma.leaveRequest.findUnique({
        where:   { id },
        include: { leaveType: true, employee: true },
      });

      if (!leaveReq) {
        return sendError(res, 'Leave request not found', 404);
      }

      if (leaveReq.status !== LeaveStatus.PENDING) {
        return sendError(res, `Cannot review a request that is already ${leaveReq.status}`, 400);
      }

      const reviewerEmployeeId = req.user?.employeeId || null;

      const updated = await prisma.$transaction(async (tx) => {
        // 1. Update request status & reviewer info
        const updatedReq = await tx.leaveRequest.update({
          where: { id },
          data: {
            status,
            reviewedById:    reviewerEmployeeId,
            reviewerComment,
            reviewedAt:      new Date(),
          },
        });

        if (status === LeaveStatus.APPROVED && leaveReq.leaveType.code !== 'UL') {
          // 2. Deduct leave balance
          await tx.leaveBalance.update({
            where: {
              employeeId_leaveTypeId: {
                employeeId:  leaveReq.employeeId,
                leaveTypeId: leaveReq.leaveTypeId,
              },
            },
            data: {
              used:      { increment: leaveReq.totalDays },
              remaining: { decrement: leaveReq.totalDays },
            },
          });

          // 3. Mark each working day in the leave range as ON_LEAVE in attendance
          const cur = new Date(leaveReq.startDate);
          while (cur <= leaveReq.endDate) {
            const dayOfWeek = cur.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
              const workDate = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate());
              await tx.attendance.upsert({
                where: {
                  employeeId_workDate: {
                    employeeId: leaveReq.employeeId,
                    workDate,
                  },
                },
                update: {
                  status:  AttendanceStatus.ON_LEAVE,
                  remarks: `Approved ${leaveReq.leaveType.name}`,
                },
                create: {
                  employeeId: leaveReq.employeeId,
                  workDate,
                  status:     AttendanceStatus.ON_LEAVE,
                  totalHours: 0,
                  remarks:    `Approved ${leaveReq.leaveType.name}`,
                },
              });
            }
            cur.setDate(cur.getDate() + 1);
          }
        }

        // 4. Write Audit Log
        await tx.auditLog.create({
          data: {
            action:        status === LeaveStatus.APPROVED ? 'APPROVE_LEAVE' : 'REJECT_LEAVE',
            entity:        'LeaveRequest',
            entityId:      id,
            performedById: req.user?.userId || 'SYSTEM',
            details:       JSON.stringify({
              leaveRequestId: id,
              employeeId:     leaveReq.employeeId,
              status,
              reviewerComment,
            }),
          },
        });

        return updatedReq;
      });

      return sendSuccess(res, updated, `Leave request has been ${status.toLowerCase()}`);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * List all available leave types.
   */
  static async getLeaveTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const types = await prisma.leaveType.findMany();
      return sendSuccess(res, types, 'Leave types fetched successfully');
    } catch (error: any) {
      next(error);
    }
  }
}
