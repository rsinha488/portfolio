import express from 'express';
import {
    getTimeline,
    createTimelineItem,
    updateTimelineItem,
    deleteTimelineItem
} from '../controllers/timelineController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTimeline);
router.post('/', isAdmin, createTimelineItem);
router.put('/:id', isAdmin, updateTimelineItem);
router.delete('/:id', isAdmin, deleteTimelineItem);

export default router;
