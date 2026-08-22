import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config';
import { sendSuccess, sendError } from '../utils/response.util';
import { AttendanceStatus } from '@prisma/client';

/**
 * Controller for Attendance & Punch Clock Tracking
 */
export class AttendanceController {
  /**
   * Toggle Punch In / Punch Out for the currently authenticated employee.
   * - First call of the day → Check In
   * - Second call → Check Out (calculates total hours & auto-determines PRESENT / HALF_DAY / ABSENT)
   * - Subsequent calls → Update Checkout time
   */
  static async punch(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.employeeId) {
        return sendError(res, 'No employee record found for user', 400);
      }

      const employeeId = req.user.employeeId;
      const now = new Date();

      // Normalise today to midnight (start of day) for the unique constraint
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // ─── Check for existing today record ─────────────────────────────────
      const existing = await prisma.attendance.findUnique({
        where: {
          employeeId_workDate: {
            employeeId,
            workDate: startOfDay,
          },
        },
      });

      if (!existing) {
        // ── First punch → Check In ──────────────────────────────────────────
        const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);

        const newRecord = await prisma.attendance.create({
          data: {
            employeeId,
            workDate: startOfDay,
            checkIn: now,
            status: AttendanceStatus.PRESENT,
            isLate,
            remarks: isLate ? 'Late arrival' : 'On-time arrival',
          },
        });

        return sendSuccess(
          res,
          { record: newRecord, type: 'CHECK_IN' },
          `Checked in successfully at ${now.toLocaleTimeString()}`
        );

      } else if (!existing.checkOut) {
        // ── Second punch → Check Out ────────────────────────────────────────
        const checkInTime = existing.checkIn ? new Date(existing.checkIn).getTime() : now.getTime();
        const durationMs  = now.getTime() - checkInTime;
        const totalHours  = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100;

        // Auto-determine attendance status based on hours worked
        let status: AttendanceStatus = AttendanceStatus.PRESENT;
        if (totalHours < 4.0)       status = AttendanceStatus.ABSENT;
        else if (totalHours < 8.0)  status = AttendanceStatus.HALF_DAY;

        const updated = await prisma.attendance.update({
          where: { id: existing.id },
          data: { checkOut: now, totalHours, status },
        });

        return sendSuccess(
          res,
          { record: updated, type: 'CHECK_OUT' },
          `Checked out successfully at ${now.toLocaleTimeString()}. Total hours: ${totalHours} hrs`
        );

      } else {
        // ── Re-punch → Update Checkout time ────────────────────────────────
        const checkInTime = existing.checkIn ? new Date(existing.checkIn).getTime() : now.getTime();
        const durationMs  = now.getTime() - checkInTime;
        const totalHours  = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100;

        const updated = await prisma.attendance.update({
          where: { id: existing.id },
          data: { checkOut: now, totalHours },
        });

        return sendSuccess(
          res,
          { record: updated, type: 'RE_CHECK_OUT' },
          `Check-out updated. Total hours: ${totalHours} hrs`
        );
      }
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get today's live punch status for the authenticated employee.
   */
  static async getTodayStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.employeeId) {
        return sendError(res, 'No employee record found', 400);
      }

      const now        = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const record = await prisma.attendance.findUnique({
        where: {
          employeeId_workDate: {
            employeeId: req.user.employeeId,
            workDate: startOfDay,
          },
        },
      });

      return sendSuccess(
        res,
        {
          hasCheckedIn:  !!record?.checkIn,
          hasCheckedOut: !!record?.checkOut,
          checkIn:       record?.checkIn  || null,
          checkOut:      record?.checkOut || null,
          totalHours:    record?.totalHours || 0,
          status:        record?.status || 'NOT_CHECKED_IN',
        },
        'Today status fetched'
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get attendance records for the authenticated employee (up to last 31 days).
   * Supports date range filtering via ?startDate=&endDate= query params.
   */
  static async getMyRecords(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.employeeId) {
        return sendError(res, 'No employee record found', 400);
      }

      const { startDate, endDate } = req.query;
      const whereClause: any = { employeeId: req.user.employeeId };

      if (startDate && endDate) {
        whereClause.workDate = {
          gte: new Date(startDate as string),
          lte: new Date(endDate   as string),
        };
      }

      const records = await prisma.attendance.findMany({
        where: whereClause,
        orderBy: { workDate: 'desc' },
        take: 31,
      });

      // ─── Calculate summary stats ──────────────────────────────────────────
      let totalLoggedHours = 0;
      let presentCount     = 0;
      let lateCount        = 0;

      records.forEach((r) => {
        totalLoggedHours += r.totalHours;
        if (r.status === AttendanceStatus.PRESENT) presentCount++;
        if (r.isLate) lateCount++;
      });

      return sendSuccess(
        res,
        {
          records,
          summary: {
            totalLoggedHours: Math.round(totalLoggedHours * 10) / 10,
            presentDays:  presentCount,
            lateDays:     lateCount,
            totalRecords: records.length,
          },
        },
        'My attendance records fetched'
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get company-wide attendance muster roll for a specific date (Admin / HR).
   * Supports ?date=, ?departmentId=, ?status= filters.
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, departmentId, status } = req.query;

      const targetDate = date ? new Date(date as string) : new Date();
      const startOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate()
      );

      const whereClause: any = { workDate: startOfDay };

      if (status)       whereClause.status   = status as AttendanceStatus;
      if (departmentId) whereClause.employee = { departmentId: departmentId as string };

      const records = await prisma.attendance.findMany({
        where: whereClause,
        include: {
          employee: {
            include: { department: true },
          },
        },
        orderBy: { checkIn: 'asc' },
      });

      return sendSuccess(
        res,
        { date: startOfDay, count: records.length, records },
        'All attendance records fetched'
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Admin attendance override / time adjustment.
   * Logs the change to the Audit Trail.
   */
  static async override(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { checkIn, checkOut, status, remarks } = req.body;

      const existing = await prisma.attendance.findUnique({ where: { id } });
      if (!existing) {
        return sendError(res, 'Attendance record not found', 404);
      }

      // Recalculate total hours if new timestamps are provided
      let totalHours        = existing.totalHours;
      const updatedCheckIn  = checkIn  ? new Date(checkIn)  : existing.checkIn;
      const updatedCheckOut = checkOut ? new Date(checkOut) : existing.checkOut;

      if (updatedCheckIn && updatedCheckOut) {
        const duration = updatedCheckOut.getTime() - updatedCheckIn.getTime();
        totalHours = Math.round((duration / (1000 * 60 * 60)) * 100) / 100;
      }

      const updated = await prisma.attendance.update({
        where: { id },
        data: {
          checkIn:    updatedCheckIn,
          checkOut:   updatedCheckOut,
          totalHours,
          status:     status  || existing.status,
          remarks:    remarks || existing.remarks,
        },
      });

      // ─── Audit Trail ──────────────────────────────────────────────────────
      await prisma.auditLog.create({
        data: {
          action:        'OVERRIDE_ATTENDANCE',
          entity:        'Attendance',
          entityId:      id,
          performedById: req.user?.userId || 'SYSTEM',
          details:       JSON.stringify({ previous: existing, updated }),
        },
      });

      return sendSuccess(res, updated, 'Attendance overridden successfully');
    } catch (error: any) {
      next(error);
    }
  }
}
