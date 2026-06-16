import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Timeline from '../models/Timeline.js';

dotenv.config({ path: '.env.local' });

const dummyTimeline = [
    {
        year: '2024',
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Solutions',
        description: 'Leading development of scalable microservices and React-based dashboards serving 500k+ users. Mentoring junior developers and driving architectural decisions.',
        type: 'experience',
        order: 1,
    },
    {
        year: '2023',
        title: 'Full Stack Developer',
        company: 'InnovateLab',
        description: 'Built and shipped 3 production MERN stack applications. Reduced API response time by 40% through query optimization and Redis caching.',
        type: 'experience',
        order: 2,
    },
    {
        year: '2022',
        title: 'Frontend Developer',
        company: 'PixelCraft Agency',
        description: 'Developed responsive web interfaces for 10+ client projects using React and Next.js. Collaborated closely with UI/UX designers to implement pixel-perfect designs.',
        type: 'experience',
        order: 3,
    },
    {
        year: '2021',
        title: 'B.Tech in Computer Science',
        company: 'Delhi Technological University',
        description: 'Graduated with honours. Specialized in software engineering and distributed systems. Final year project on real-time collaborative editing won the best project award.',
        type: 'education',
        order: 4,
    },
    {
        year: '2020',
        title: 'Software Engineering Intern',
        company: 'StartupXYZ',
        description: 'Contributed to a Node.js backend handling 10k daily requests. Wrote REST APIs, unit tests, and improved CI/CD pipeline reducing deployment time by 30%.',
        type: 'experience',
        order: 5,
    },
    {
        year: '2019',
        title: 'Web Development Certification',
        company: 'Coursera / Meta',
        description: 'Completed the Meta Front-End Developer Professional Certificate covering React, JavaScript, HTML/CSS, and UX fundamentals.',
        type: 'education',
        order: 6,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Timeline.deleteMany({});
        console.log('Cleared existing timeline entries');

        await Timeline.insertMany(dummyTimeline);
        console.log(`Seeded ${dummyTimeline.length} timeline entries`);
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

seed();
