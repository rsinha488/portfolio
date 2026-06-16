import express from 'express';
import {
    getProjects,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject
} from '../controllers/projectController.js';
import { isAdmin } from '../middleware/authMiddleware.js';
import { validate, projectSchema } from '../middleware/validation.js';

const router = express.Router();

// Public Routes
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

// Admin Routes
router.post('/', isAdmin, validate(projectSchema), createProject);
router.put('/:id', isAdmin, validate(projectSchema), updateProject);
router.delete('/:id', isAdmin, deleteProject);

export default router;
