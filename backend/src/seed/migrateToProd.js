import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Timeline from '../models/Timeline.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Testimonial from '../models/Testimonial.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

// Configure DNS to resolve Atlas querySrv SRV records
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.warn("Could not set DNS servers:", e);
}

// Load config files
dotenv.config({ path: '.env.development' });
dotenv.config({ path: '../.env' });

const LOCAL_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';
let PROD_URI = process.env.MONGO_CLUSTER_URL;

if (!PROD_URI) {
    console.error("Error: MONGO_CLUSTER_URL is not defined in root .env file!");
    process.exit(1);
}

// Append portfolio database name if not present
if (!PROD_URI.includes('/portfolio')) {
    PROD_URI = PROD_URI.endsWith('/') ? `${PROD_URI}portfolio` : `${PROD_URI}/portfolio`;
}

async function migrate() {
    let localData = {};

    try {
        // 1. Connect to Local MongoDB
        console.log('Connecting to Local MongoDB at:', LOCAL_URI);
        await mongoose.connect(LOCAL_URI);
        console.log('Connected to Local MongoDB. Fetching documents...');

        // Fetch all data from all collections
        localData.profiles = await Profile.find({});
        localData.skills = await Skill.find({});
        localData.timeline = await Timeline.find({});
        localData.projects = await Project.find({});
        localData.achievements = await Achievement.find({});
        localData.testimonials = await Testimonial.find({});
        localData.contacts = await Contact.find({});
        localData.users = await User.find({});
        localData.blogs = await Blog.find({});

        console.log(`Fetched data summaries:
- Profiles: ${localData.profiles.length}
- Skills Categories: ${localData.skills.length}
- Timeline milestones: ${localData.timeline.length}
- Projects: ${localData.projects.length}
- Achievements: ${localData.achievements.length}
- Testimonials: ${localData.testimonials.length}
- Contacts (Messages): ${localData.contacts.length}
- Users: ${localData.users.length}
- Blogs: ${localData.blogs.length}
`);

        // Disconnect from local
        await mongoose.disconnect();
        console.log('Disconnected from Local MongoDB.');

        // 2. Connect to Production MongoDB Atlas
        console.log('\nConnecting to Production MongoDB Atlas at:', PROD_URI.replace(/:([^@]+)@/, ':****@')); // Hide password in logs
        await mongoose.connect(PROD_URI);
        console.log('Connected to Production MongoDB. Clearing production collections...');

        // Clear production collections
        await Profile.deleteMany({});
        await Skill.deleteMany({});
        await Timeline.deleteMany({});
        await Project.deleteMany({});
        await Achievement.deleteMany({});
        await Testimonial.deleteMany({});
        await Contact.deleteMany({});
        await User.deleteMany({});
        await Blog.deleteMany({});
        console.log('Cleared all collections in production.');

        // Insert local documents into production
        if (localData.profiles.length > 0) await Profile.insertMany(localData.profiles);
        if (localData.skills.length > 0) await Skill.insertMany(localData.skills);
        if (localData.timeline.length > 0) await Timeline.insertMany(localData.timeline);
        if (localData.projects.length > 0) await Project.insertMany(localData.projects);
        if (localData.achievements.length > 0) await Achievement.insertMany(localData.achievements);
        if (localData.testimonials.length > 0) await Testimonial.insertMany(localData.testimonials);
        if (localData.contacts.length > 0) await Contact.insertMany(localData.contacts);
        if (localData.users.length > 0) await User.insertMany(localData.users);
        if (localData.blogs.length > 0) await Blog.insertMany(localData.blogs);

        console.log('All local data successfully written to production MongoDB Atlas!');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from Production MongoDB Atlas.');
    }
}

migrate();
