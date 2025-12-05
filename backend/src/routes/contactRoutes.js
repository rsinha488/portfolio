import express from 'express';
import {
    submitContact,
    getMessages,
    markAsRead,
    deleteMessage
} from '../controllers/contactController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', isAdmin, getMessages);
router.put('/:id/read', isAdmin, markAsRead);
router.delete('/:id', isAdmin, deleteMessage);

export default router;
