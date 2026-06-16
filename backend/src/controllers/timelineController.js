import Timeline from '../models/Timeline.js';

export const getTimeline = async (req, res) => {
    try {
        const timeline = await Timeline.find().sort({ order: 1, year: -1 });
        res.json(timeline);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTimelineItem = async (req, res) => {
    try {
        const item = new Timeline(req.body);
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTimelineItem = async (req, res) => {
    try {
        const item = await Timeline.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTimelineItem = async (req, res) => {
    try {
        const item = await Timeline.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
