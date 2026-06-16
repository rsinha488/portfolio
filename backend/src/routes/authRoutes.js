import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const CLIENT_URL = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

// Google Auth
router.get('/google', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({
            message: "Google Auth is not configured. Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment variables."
        });
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${CLIENT_URL}/login?error=google_auth_failed`,
        session: true
    }),
    (req, res) => {
        const user = req.user;
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'dev_jwt_secret',
            { expiresIn: '7d' }
        );

        res.cookie('portfolio_auth', token, {
            httpOnly: true,
            secure: true, // Required for 'none'
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.redirect(`${CLIENT_URL}/dashboard`);
    }
);

// Facebook Auth
router.get('/facebook', (req, res, next) => {
    if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
        return res.status(500).json({
            message: "Facebook Auth is not configured. Missing FACEBOOK_CLIENT_ID or FACEBOOK_CLIENT_SECRET in environment variables."
        });
    }
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
});

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: `${CLIENT_URL}/login?error=facebook_auth_failed`,
        session: true
    }),
    (req, res) => {
        const user = req.user;
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'dev_jwt_secret',
            { expiresIn: '7d' }
        );

        res.cookie('portfolio_auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.redirect(`${CLIENT_URL}/dashboard`);
    }
);

// Logout
router.post('/logout', (req, res, next) => {
    res.clearCookie('portfolio_auth');
    res.clearCookie('portfolio_session');
    
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) return next(err);
            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});

// Check Auth Status (for frontend)
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: req.user
        });
    } else {
        res.json({ authenticated: false, user: null });
    }
});

export default router;
