import express from 'express';
import {
    getTimeline,
    createTimelineItem,
    updateTimelineItem,
    deleteTimelineItem
} from '../controllers/timelineController.js';
import { isAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validation.js';
import { z } from 'zod';

const timelineSchema = z.object({
    title: z.string().min(2),
    organization: z.string().min(2),
    location: z.string().optional(),
    from: z.string(),
    to: z.string().optional(),
    description: z.string().min(10),
    type: z.enum(['work', 'education']),
    icon: z.string().optional()
});

const router = express.Router();

router.get('/', getTimeline);
router.post('/', isAdmin, validate(timelineSchema), createTimelineItem);
router.put('/:id', isAdmin, validate(timelineSchema), updateTimelineItem);
router.delete('/:id', isAdmin, deleteTimelineItem);

export default router;
