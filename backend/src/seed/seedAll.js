import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Timeline from '../models/Timeline.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Testimonial from '../models/Testimonial.js';

dotenv.config({ path: '.env.development' });
dotenv.config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_CLUSTER_URL;

const profileData = {
    name: "Ruchi Sinha",
    title: "Full Stack Software Engineer",
    bio: "Full Stack Software Engineer with 5 years of experience building scalable, high-performance web applications using React.js, Next.js, Node.js, and MongoDB. Proven track record in designing and delivering multi-tenant SaaS platforms, RESTful APIs, and AI-integrated backend systems. Experienced with real-time communication (Socket.IO), event-driven architecture, and cloud services (AWS S3). Adept at implementing Role-Based Access Control (RBAC), microservices patterns, and frontend performance optimization. Seeking to leverage expertise in full-stack development and system design to drive product excellence.",
    avatar: "/ruchi-photo.jpg",
    phone: "",
    email: "ruchi.developer@outlook.com",
    githubUrl: "https://github.com/rsinha488",
    linkedinUrl: "https://linkedin.com/in/ruchi-developer",
    twitterUrl: "",
    resumeUrl: "",
    location: "Noida, Uttar Pradesh, India"
};

const skillsData = [
    { category: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"], order: 1 },
    { category: "Frontend", items: ["React.js", "Next.js", "Redux", "Redux Toolkit", "Redux-Saga", "Tailwind CSS"], order: 2 },
    { category: "Backend", items: ["Node.js", "Express.js", "RESTful API Design", "Event-Driven Architecture"], order: 3 },
    { category: "Databases", items: ["MongoDB", "Mongoose ODM"], order: 4 },
    { category: "System Design", items: ["Multi-Tenant Architecture", "RBAC", "Distributed Systems", "Microservices", "API Design"], order: 5 },
    { category: "Real-Time & AI", items: ["Socket.IO", "VAPI (Voice AI)", "Conversational AI Integration"], order: 6 },
    { category: "Cloud & DevOps", items: ["AWS S3", "Git", "GitHub", "Postman"], order: 7 },
    { category: "Performance Optimization", items: ["Memoization", "Lazy Loading", "Code Splitting", "Async Processing", "Query Optimization"], order: 8 }
];

const timelineData = [
    {
        year: "Oct 2025 - May 2026",
        title: "Software Engineer",
        company: "Hestabit Technologies",
        description: "Architected and developed a multi-tenant SaaS platform for AI voice agents, enabling automated campaign execution at scale. Designed a campaign orchestration engine supporting bulk calls, retry logic, scheduling, and real-time call tracking. Built a scalable Node.js and MongoDB backend handling agent workflows, session lifecycle management, and tenant-isolated data storage. Developed frontend dashboards using Next.js with server-side rendering for optimized performance and routing. Integrated VAPI for real-time conversational AI and dynamic voice agent configuration. Implemented event-driven architecture using Socket.IO for real-time monitoring of active calls. Designed RBAC and tenant isolation to enforce secure multi-user access. Reduced API latency by 25% by optimizing asynchronous processing.",
        type: "experience",
        order: 1
    },
    {
        year: "Jul 2023 - Oct 2025",
        title: "Software Engineer",
        company: "Chetu India Pvt. Ltd",
        description: "Developed role-specific dashboards for a Supply Chain Management System using Next.js, supporting Admin, Warehouse Owner, Sales, and Buyer personas. Built a real-time multiplayer gaming platform Mega2 using React.js featuring timed selection, live ball-spins, and dynamic win/loss. Developed Node.js RESTful APIs handling inventory workflows, stock validation, transaction logic, and game session management. Implemented real-time stock shortage alerts and player chat using Socket.IO. Designed and enforced granular RBAC across both projects. Managed complex game state and countdown timer logic using Redux. Integrated Redux Toolkit and Axios. Optimized performance using memoization, lazy loading, and code splitting.",
        type: "experience",
        order: 2
    },
    {
        year: "May 2021 - Jul 2023",
        title: "Software Developer",
        company: "Integrated Personnel Connecting Tech",
        description: "Developed and maintained RESTful APIs using Node.js and MongoDB for a Human Resource Management System (HRMS) platform. Built scalable backend modules for authentication, authorization, and employee lifecycle workflows. Developed a Next.js-based marketing and branding website for the HRMS platform, leveraging static site generation (SSG) for fast load times and improved search engine visibility. Integrated AWS S3 for secure, scalable file storage. Developed frontend modules using React.js and Redux-Saga for real-time data updates. Designed and maintained database schemas in MongoDB.",
        type: "experience",
        order: 3
    },
    {
        year: "2018 - 2021",
        title: "Master of Computer Applications (MCA)",
        company: "Patliputra University",
        description: "Completed MCA specializing in software engineering and web application architectures with an academic score of 8.86 / 10 CGPA.",
        type: "education",
        order: 4
    },
    {
        year: "2015 - 2018",
        title: "Bachelor of Computer Applications (BCA)",
        company: "Aryabhatta Knowledge University",
        description: "Completed BCA with a focus on core programming concepts, database management, and web development, achieving 9.14 / 10 CGPA.",
        type: "education",
        order: 5
    },
    {
        year: "2013 - 2015",
        title: "Intermediate (PCMB)",
        company: "Kendriya Vidyalaya, Patna",
        description: "Completed Intermediate education specializing in PCMB (Physics, Chemistry, Mathematics, Biology) under CBSE Board with a score of 68.2%.",
        type: "education",
        order: 6
    },
    {
        year: "2013",
        title: "Matriculation (10th)",
        company: "Kendriya Vidyalaya, Patna",
        description: "Completed Matriculation education under CBSE Board, achieving an academic score of 9.2 CGPA.",
        type: "education",
        order: 7
    }
];

const projectsData = [
    {
        title: "AI-Powered Insurance Policy Assistant",
        slug: "ai-powered-insurance-policy-assistant",
        description: "RAG-based self-service chat assistant where employees query their enrolled insurance policy documents and get cited answers.",
        technologies: ["Next.js", "Node.js", "Express", "PostgreSQL", "Prisma ORM", "pgvector", "OpenAI API", "Embeddings", "Semantic Search", "Prompt Engineering", "AI Guardrails", "Socket.IO", "Multi-tenant", "RBAC"],
        featured: true,
        order: 1,
        images: [{ url: "/ruchi-photo.jpg", alt: "AI-Powered Insurance Policy Assistant" }]
    },
    {
        title: "AI Voice Agent & Campaign Platform",
        slug: "ai-voice-agent-campaign-platform",
        description: "SaaS platform for businesses to create AI voice agents, run outbound calling campaigns with batch processing, and collect structured feedback.",
        technologies: ["Next.js", "Node.js", "MongoDB", "VAPI", "Twilio", "Prompt Engineering", "Context Injection", "Cron Jobs", "Socket.IO", "Multi-tenant", "RBAC"],
        featured: true,
        order: 2,
        images: [{ url: "/ruchi-photo.jpg", alt: "AI Voice Agent & Campaign Platform" }]
    },
    {
        title: "HRMS Branding and marketing Site",
        slug: "hrms-branding-marketing-site-ipsl",
        description: "Its a marketing and brandinding website for HRMS application",
        technologies: ["Next.js", "MongoDB", "Node.js", "React.js"],
        featured: true,
        order: 3,
        images: [{ url: "/ruchi-photo.jpg", alt: "HRMS Branding and Marketing Site" }]
    },
    {
        title: "SCMS (Supply Chain Management System)",
        slug: "scms-chetu-india-noida",
        description: "Enterprise supply chain management platform supporting inventory operations, procurement workflows, supplier management, and role-based access control with optimized performance and scalable UI architecture.",
        technologies: ["React.js", "Next.js", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Axios", "REST APIs", "Node.js", "MongoDB"],
        featured: true,
        order: 4,
        images: [{ url: "/ruchi-photo.jpg", alt: "SCMS Chetu India Noida" }]
    },
    {
        title: "HRMS Application",
        slug: "hrms-application-ipsl-mumbai",
        description: "Full-stack HR management platform handling employee lifecycle operations, leave management, authentication, document storage, and administrative workflows.",
        technologies: ["React.js", "Next.js", "TypeScript", "Node.js", "Express.js", "MongoDB", "Redux Saga", "AWS S3", "REST APIs"],
        featured: false,
        order: 5,
        images: [{ url: "/ruchi-photo.jpg", alt: "HRMS Application IPSL Mumbai" }]
    },
    {
        title: "Real-Time Gaming Platform (Mega Ball Games)",
        slug: "real-time-gaming-mega-ball-games",
        description: "Real-time event-driven platform supporting live game updates, synchronized user interactions, instant notifications, and high-frequency state updates.",
        technologies: ["React.js", "Next.js", "TypeScript", "Socket.IO", "Redux Toolkit", "Tailwind CSS", "Node.js", "REST APIs"],
        featured: false,
        order: 6,
        images: [{ url: "/ruchi-photo.jpg", alt: "Real-Time Gaming Mega Ball Games" }]
    },
    {
        title: "Cyber Analytics Dashboard",
        slug: "cyber-analytics-dashboard-chetu-india-noida",
        description: "Analytics and reporting platform for monitoring social media performance, engagement trends, and retailer insights through interactive dashboards and visualization modules.",
        technologies: ["React.js", "Next.js", "TypeScript", "Redux Toolkit", "Tailwind CSS", "REST APIs", "Chart Libraries"],
        featured: false,
        order: 7,
        images: [{ url: "/ruchi-photo.jpg", alt: "Cyber Analytics Dashboard" }]
    }
];

const achievementsData = [
    { text: "25% reduction in API latency at Hestabit by implementing asynchronous processing and query optimization.", order: 1 },
    { text: "Successfully architected a multi-tenant SaaS platform from scratch, enabling isolated, secure access for multiple enterprise clients.", order: 2 },
    { text: "Delivered two full-stack production platforms at Chetu - a Supply Chain Management System and a real-time multiplayer gaming platform - across React.js, Next.js, and Node.js.", order: 3 },
    { text: "Achieved consistently high academic performance - 8.86 GPA (MCA) and 9.14 GPA (BCA).", order: 4 }
];

const testimonialsData = [
    {
        name: "Suresh Sharma",
        role: "Lead Project Manager",
        company: "Hestabit Technologies",
        content: "Ruchi is an exceptional Full Stack Engineer. She architected our voice agent SaaS platform and reduced system response times significantly. Her technical skills and event-driven architecture designs were key to our project success.",
        rating: 5,
        featured: true
    },
    {
        name: "Amit Patel",
        role: "Delivery Head",
        company: "Chetu India Pvt. Ltd",
        content: "Ruchi's ability to manage complex state transitions and design secure role-based access control systems was invaluable during her tenure. She is highly proactive and writes very maintainable full-stack code.",
        rating: 5,
        featured: true
    }
];

async function seed() {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI environment variable is missing!");
        }

        console.log('Connecting to MongoDB at:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Profile.deleteMany({});
        await Skill.deleteMany({});
        await Timeline.deleteMany({});
        await Project.deleteMany({});
        await Achievement.deleteMany({});
        await Testimonial.deleteMany({});
        console.log('Cleared existing database entries');

        // Insert new data
        await Profile.create(profileData);
        console.log('Seeded Profile');

        await Skill.insertMany(skillsData);
        console.log(`Seeded ${skillsData.length} Skill categories`);

        await Timeline.insertMany(timelineData);
        console.log(`Seeded ${timelineData.length} Timeline milestones`);

        await Project.insertMany(projectsData);
        console.log(`Seeded ${projectsData.length} Projects`);

        await Achievement.insertMany(achievementsData);
        console.log(`Seeded ${achievementsData.length} Key Achievements`);

        await Testimonial.insertMany(testimonialsData);
        console.log(`Seeded ${testimonialsData.length} Testimonials`);

        console.log('Database Seeding Completed Successfully!');
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seed();
