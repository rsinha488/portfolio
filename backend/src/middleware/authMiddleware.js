import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

const getUser = async (req) => {
    // Try JWT from Authorization header first
    let token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;

    // Try JWT from cookies if not in header
    if (!token && req.cookies) {
        token = req.cookies.portfolio_auth;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
            return await User.findById(decoded.id);
        } catch {
            return null;
        }
    }
    // Fall back to session
    if (req.isAuthenticated()) return req.user;
    return null;
};

export const isAuthenticated = async (req, res, next) => {
    const user = await getUser(req);
    if (user) {
        req.user = user;
        return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
};

export const isAdmin = async (req, res, next) => {
    const user = await getUser(req);
    if (user?.role === 'admin') {
        req.user = user;
        return next();
    }
    res.status(403).json({ message: 'Access denied. Admin only.' });
};
