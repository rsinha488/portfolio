import express from 'express';
import { cloudinary, createUpload } from '../config/cloudinary.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/upload?type=projects|blogs|avatars|thumbnails
router.post('/', isAdmin, (req, res) => {
    const type = req.query.type || 'projects';
    const uploader = createUpload(type);

    uploader.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({
            url: req.file.path,
            public_id: req.file.filename,
            type,
        });
    });
});

// DELETE /api/upload  { public_id }
router.delete('/', isAdmin, async (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ message: 'public_id required' });
        await cloudinary.uploader.destroy(public_id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/upload/bulk-delete  { public_ids: [] }
router.post('/bulk-delete', isAdmin, async (req, res) => {
    try {
        const { public_ids } = req.body;
        if (!Array.isArray(public_ids)) return res.status(400).json({ message: 'public_ids must be an array' });
        await cloudinary.api.delete_resources(public_ids);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
