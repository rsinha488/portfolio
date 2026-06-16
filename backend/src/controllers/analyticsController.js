import Visit from '../models/Visit.js';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import Testimonial from '../models/Testimonial.js';
import Contact from '../models/Contact.js';
import Skill from '../models/Skill.js';
import crypto from 'crypto';

// Log a page visit
export const logVisit = async (req, res) => {
    try {
        const userAgent = req.headers['user-agent'] || '';
        // Skip common crawlers/bots
        if (/bot|crawler|spider|crawling/i.test(userAgent)) {
            return res.status(200).json({ success: true, message: 'Bot visit ignored' });
        }

        const ip = req.ip || req.headers['x-forwarded-for'] || '';
        // Hash IP for privacy compliance
        const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

        await Visit.create({
            ipHash,
            userAgent,
        });

        res.status(201).json({ success: true, message: 'Visit logged successfully' });
    } catch (err) {
        console.error('Error logging visit:', err);
        res.status(500).json({ success: false, message: 'Error logging visit', error: err.message });
    }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // 1. Core counters
        const totalProjects = await Project.countDocuments();
        const totalBlogs = await Blog.countDocuments();
        const totalTestimonials = await Testimonial.countDocuments();
        const totalMessages = await Contact.countDocuments();
        const totalSkills = await Skill.countDocuments();
        const actualVisits = await Visit.countDocuments();
        
        // Ensure total views starts at minimum 1 as requested
        const totalViews = Math.max(1, actualVisits);

        // 2. Compute last 7 days chart data
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const startOfDay = new Date(d.setHours(0, 0, 0, 0));
            const endOfDay = new Date(d.setHours(23, 59, 59, 999));
            
            let viewsCount = await Visit.countDocuments({
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });

            // If we are showing the current day and the actual visits are 0, default it to 1 to match the 'min 1' rule
            if (i === 0 && actualVisits === 0) {
                viewsCount = 1;
            }

            chartData.push({
                date: dateStr,
                views: viewsCount
            });
        }

        // 3. Dynamic Recent Activity
        const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(3);
        const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(3);
        const recentMessages = await Contact.find().sort({ createdAt: -1 }).limit(3);
        const recentTestimonials = await Testimonial.find().sort({ createdAt: -1 }).limit(3);

        let activities = [];

        recentProjects.forEach(p => {
            activities.push({
                id: `proj-${p._id}`,
                type: 'project',
                title: 'New Project Added',
                description: `You added "${p.title}"`,
                timestamp: p.createdAt || new Date()
            });
        });

        recentBlogs.forEach(b => {
            activities.push({
                id: `blog-${b._id}`,
                type: 'blog',
                title: 'New Blog Published',
                description: `You published "${b.title}"`,
                timestamp: b.createdAt
            });
        });

        recentMessages.forEach(m => {
            activities.push({
                id: `msg-${m._id}`,
                type: 'message',
                title: 'New Message Received',
                description: `From ${m.name}: "${m.subject || 'No Subject'}"`,
                timestamp: m.createdAt
            });
        });

        recentTestimonials.forEach(t => {
            activities.push({
                id: `test-${t._id}`,
                type: 'testimonial',
                title: 'New Testimonial Received',
                description: `From ${t.name} (${t.role})`,
                timestamp: t.createdAt
            });
        });

        // Sort by timestamp descending and limit to top 5
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentActivity = activities.slice(0, 5);

        res.status(200).json({
            success: true,
            stats: {
                totalProjects,
                totalBlogs,
                totalTestimonials,
                totalMessages,
                totalSkills,
                totalViews,
            },
            chartData,
            recentActivity
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ success: false, message: 'Error fetching stats', error: err.message });
    }
};
