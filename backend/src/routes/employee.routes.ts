import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

// Employee & Department routes
router.get('/departments', authenticate, EmployeeController.getDepartments);
router.get('/', authenticate, EmployeeController.getAll);
router.get('/:id', authenticate, EmployeeController.getById);

// Admin & HR Officer only routes
router.post('/', authenticate, authorizeRoles('ADMIN', 'HR_OFFICER'), EmployeeController.create);
router.post('/:id/documents', authenticate, EmployeeController.uploadDocument);

export default router;
