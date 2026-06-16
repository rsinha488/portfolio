import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { isAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validation.js';
import { z } from 'zod';

const profileSchema = z.object({
    name: z.string().min(2),
    title: z.string().min(2),
    bio: z.string().min(10),
    avatar: z.string().optional().or(z.literal('')),
    resumeUrl: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    twitterUrl: z.string().url().optional().or(z.literal('')),
});

const router = express.Router();

router.get('/', getProfile);
router.put('/', isAdmin, validate(profileSchema), updateProfile);

export default router;
