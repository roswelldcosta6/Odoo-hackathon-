import { Router } from 'express';
import { PayrollController } from '../controllers/payroll.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

// Employee route
router.get('/my-salary', authenticate, PayrollController.getMySalary);

// Admin & HR routes
router.get('/structures', authenticate, authorizeRoles('ADMIN', 'HR_OFFICER'), PayrollController.getAllStructures);
router.put('/structures/:employeeId', authenticate, authorizeRoles('ADMIN', 'HR_OFFICER'), PayrollController.updateStructure);

export default router;
