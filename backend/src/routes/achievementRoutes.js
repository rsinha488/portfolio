import express from 'express';
import {
    getAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement
} from '../controllers/achievementController.js';
import { isAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validation.js';
import { z } from 'zod';

const achievementSchema = z.object({
    text: z.string().min(5),
    order: z.number().optional()
});

const router = express.Router();

router.get('/', getAchievements);
router.post('/', isAdmin, validate(achievementSchema), createAchievement);
router.put('/:id', isAdmin, validate(achievementSchema.partial()), updateAchievement);
router.delete('/:id', isAdmin, deleteAchievement);

export default router;
