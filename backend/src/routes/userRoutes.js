import express from 'express';
import { getUsers, deleteUser } from '../controllers/userController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', isAdmin, getUsers);
router.delete('/:id', isAdmin, deleteUser);

export default router;
