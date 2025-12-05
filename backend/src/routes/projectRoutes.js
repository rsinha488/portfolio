import express from 'express';
import {
    getProjects,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject
} from '../controllers/projectController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

// Admin Routes
router.post('/', isAdmin, createProject);
router.put('/:id', isAdmin, updateProject);
router.delete('/:id', isAdmin, deleteProject);

export default router;
