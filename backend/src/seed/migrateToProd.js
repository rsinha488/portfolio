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
const BASE_PROD_URI = process.env.MONGO_CLUSTER_URL;

if (!BASE_PROD_URI) {
    console.error("Error: MONGO_CLUSTER_URL is not defined in root .env file!");
    process.exit(1);
}

// Define the two possible production URIs (with portfolio DB name, and default /test)
const PROD_URI_PORTFOLIO = BASE_PROD_URI.includes('/portfolio') 
    ? BASE_PROD_URI 
    : (BASE_PROD_URI.endsWith('/') ? `${BASE_PROD_URI}portfolio` : `${BASE_PROD_URI}/portfolio`);

const PROD_URI_TEST = BASE_PROD_URI.includes('/test')
    ? BASE_PROD_URI
    : (BASE_PROD_URI.endsWith('/') ? `${BASE_PROD_URI}test` : `${BASE_PROD_URI}/test`);

const PROD_URI_DEFAULT = BASE_PROD_URI; // Default if no DB is appended (connects to test by default)

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

        // Helper function to write data to a target database URI
        const writeToTarget = async (targetUri, dbLabel) => {
            console.log(`\n--- Writing to Production DB (${dbLabel}) ---`);
            const displayUri = targetUri.replace(/:([^@]+)@/, ':****@');
            console.log('Connecting to:', displayUri);
            
            await mongoose.connect(targetUri);
            console.log(`Connected. Clearing ${dbLabel} collections...`);
            
            await Profile.deleteMany({});
            await Skill.deleteMany({});
            await Timeline.deleteMany({});
            await Project.deleteMany({});
            await Achievement.deleteMany({});
            await Testimonial.deleteMany({});
            await Contact.deleteMany({});
            await User.deleteMany({});
            await Blog.deleteMany({});
            console.log('Collections cleared.');

            // Insert documents
            if (localData.profiles.length > 0) await Profile.insertMany(localData.profiles);
            if (localData.skills.length > 0) await Skill.insertMany(localData.skills);
            if (localData.timeline.length > 0) await Timeline.insertMany(localData.timeline);
            if (localData.projects.length > 0) await Project.insertMany(localData.projects);
            if (localData.achievements.length > 0) await Achievement.insertMany(localData.achievements);
            if (localData.testimonials.length > 0) await Testimonial.insertMany(localData.testimonials);
            if (localData.contacts.length > 0) await Contact.insertMany(localData.contacts);
            if (localData.users.length > 0) await User.insertMany(localData.users);
            if (localData.blogs.length > 0) await Blog.insertMany(localData.blogs);

            console.log(`Success: All data written to ${dbLabel} database.`);
            await mongoose.disconnect();
            console.log(`Disconnected from ${dbLabel}.`);
        };

        // Write to all target production databases
        await writeToTarget(PROD_URI_PORTFOLIO, 'portfolio');
        await writeToTarget(PROD_URI_TEST, 'test');
        await writeToTarget(PROD_URI_DEFAULT, 'default/test-fallback');

        console.log('\nMigration completed successfully for all database scopes!');

    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrate();
