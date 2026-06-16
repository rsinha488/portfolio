import Achievement from '../models/Achievement.js';

// Get all achievements (Public)
export const getAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find().sort({ order: 1, createdAt: 1 });
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create an achievement (Admin)
export const createAchievement = async (req, res) => {
    try {
        const achievement = new Achievement(req.body);
        const savedAchievement = await achievement.save();
        res.status(201).json(savedAchievement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an achievement (Admin)
export const updateAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json(achievement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an achievement (Admin)
export const deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndDelete(req.params.id);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
