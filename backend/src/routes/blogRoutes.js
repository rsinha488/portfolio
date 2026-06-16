import express from 'express';
import {
    getBlogs,
    getAllBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog
} from '../controllers/blogController.js';
import { isAdmin } from '../middleware/authMiddleware.js';
import { validate, blogSchema } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getBlogs); // Public: Published only
router.get('/all', isAdmin, getAllBlogs); // Admin: All
router.get('/:slug', getBlogBySlug);
router.post('/', isAdmin, validate(blogSchema), createBlog);
router.put('/:id', isAdmin, validate(blogSchema), updateBlog);
router.delete('/:id', isAdmin, deleteBlog);

export default router;
