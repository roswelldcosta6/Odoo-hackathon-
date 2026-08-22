import { Router } from 'express';
import { LeaveController } from '../controllers/leave.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

// Employee routes
router.get('/types', authenticate, LeaveController.getLeaveTypes);
router.get('/balances', authenticate, LeaveController.getBalances);
router.post('/apply', authenticate, LeaveController.apply);
router.get('/my-requests', authenticate, LeaveController.getMyRequests);

// Admin & HR routes
router.get('/all', authenticate, authorizeRoles('ADMIN', 'HR_OFFICER'), LeaveController.getAll);
router.patch('/:id/review', authenticate, authorizeRoles('ADMIN', 'HR_OFFICER'), LeaveController.review);

export default router;
