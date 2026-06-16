import express from 'express';
import {
    getTestimonials,
    getAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} from '../controllers/testimonialController.js';
import { isAdmin } from '../middleware/authMiddleware.js';
import { validate, testimonialSchema } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getTestimonials); // Public: Featured only
router.get('/all', isAdmin, getAllTestimonials); // Admin: All
router.post('/', isAdmin, validate(testimonialSchema), createTestimonial);
router.put('/:id', isAdmin, validate(testimonialSchema), updateTestimonial);
router.delete('/:id', isAdmin, deleteTestimonial);

export default router;
