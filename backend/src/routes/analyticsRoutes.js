import express from 'express';
import { logVisit, getDashboardStats } from '../controllers/analyticsController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to log visit
router.post('/visit', logVisit);

// Protected route for admin to view dashboard stats
router.get('/stats', isAdmin, getDashboardStats);

export default router;
