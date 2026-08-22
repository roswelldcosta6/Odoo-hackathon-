import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Analytics Feed (Accessible to authenticated users, tailored for Dashboard widgets)
router.get('/dashboard', authenticate, AnalyticsController.getDashboardMetrics);

export default router;
