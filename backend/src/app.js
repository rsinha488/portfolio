import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
dotenv.config({ path: '.env.local' }); // Also load .env.local if it exists
dotenv.config({ path: '../.env' }); // Load root .env if it exists

// Critical Security Checks
if (!process.env.JWT_SECRET || !process.env.SESSION_SECRET) {
    if (process.env.NODE_ENV === 'production') {
        console.error('FATAL ERROR: JWT_SECRET or SESSION_SECRET not defined.');
        process.exit(1);
    } else {
        console.warn('WARNING: JWT_SECRET or SESSION_SECRET not defined. Using insecure defaults for development.');
    }
}

const app = express();

// Middleware
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

app.use(cors({
    origin: [frontendUrl],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Data Sanitization against NoSQL query injection
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());

// Data Sanitization against XSS
import xss from 'xss-clean';
app.use(xss());

// Prevent Parameter Pollution
import hpp from 'hpp';
app.use(hpp());

import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./src/docs/swagger.yaml');

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev_session_secret',
    resave: false,
    saveUninitialized: false,
    name: 'portfolio_session',
    proxy: true, // Required for secure cookies behind a proxy (Render/Vercel)
    cookie: {
        secure: true, // Force secure in production, most dev envs also need it if 'none' is used
        httpOnly: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the My Portfolio API' });
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

export default app;
