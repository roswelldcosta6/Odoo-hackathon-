import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

// Employee routes
router.post('/punch', authenticate, AttendanceController.punch);
router.get('/today-status', authenticate, AttendanceController.getTodayStatus);
router.get('/my-records', authenticate, AttendanceController.getMyRecords);

// Admin & HR Officer routes
router.get('/all', authenticate, authorizeRoles('ADMIN', 'HR_OFFICER'), AttendanceController.getAll);
router.patch('/:id/override', authenticate, authorizeRoles('ADMIN', 'HR_OFFICER'), AttendanceController.override);

export default router;
