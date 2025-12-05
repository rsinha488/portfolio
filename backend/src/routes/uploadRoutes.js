import express from 'express';
import { upload } from '../config/cloudinary.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload Image (Admin only)
router.post('/', isAdmin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
        url: req.file.path,
        publicId: req.file.filename
    });
});

export default router;
