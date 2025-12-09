import express from 'express';
import passport from 'passport';

const router = express.Router();

const CLIENT_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

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
        // Successful authentication, redirect home.
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
        res.redirect(`${CLIENT_URL}/dashboard`);
    }
);

// Logout
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie('connect.sid'); // Default session cookie name
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
