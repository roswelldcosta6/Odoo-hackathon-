import { Router } from 'express';
import authRoutes from './auth.routes';
import employeeRoutes from './employee.routes';
import attendanceRoutes from './attendance.routes';
import leaveRoutes from './leave.routes';
import payrollRoutes from './payroll.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

// API Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Dayflow HRMS Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Route Bindings
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/leaves', leaveRoutes);
router.use('/payroll', payrollRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
