import Contact from '../models/Contact.js';

export const submitContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const message = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const message = await Contact.findByIdAndDelete(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
