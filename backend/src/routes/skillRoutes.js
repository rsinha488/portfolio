import express from 'express';
import Skill from '../models/Skill.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().sort({ order: 1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', isAdmin, async (req, res) => {
    try {
        const skill = await Skill.create(req.body);
        res.status(201).json(skill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', isAdmin, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!skill) return res.status(404).json({ message: 'Not found' });
        res.json(skill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
