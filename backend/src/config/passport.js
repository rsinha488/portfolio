import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️ Google OAuth env variables are missing');
}


// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    proxy: true
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ providerId: profile.id, provider: 'google' });

            if (!user) {
                // Check if email exists with different provider
                const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
                if (existingEmailUser) {
                    // Optional: Link accounts or return error. For now, we'll return existing user to prevent duplicates
                    // In a real app, you might want to merge or add 'google' to a 'providers' array.
                    return done(null, existingEmailUser);
                }

                const userCount = await User.countDocuments({});
                const role = (userCount === 0 || profile.emails[0].value === process.env.ADMIN_EMAIL) ? 'admin' : 'user';

                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    provider: 'google',
                    providerId: profile.id,
                    role
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));


// Facebook Strategy
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email'],
        proxy: true
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ providerId: profile.id, provider: 'facebook' });

                if (!user) {
                    const email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`; // Fallback if no email
                    const existingEmailUser = await User.findOne({ email });
                    if (existingEmailUser) {
                        return done(null, existingEmailUser);
                    }

                    const userCount = await User.countDocuments({});
                    const role = (userCount === 0 || email === process.env.ADMIN_EMAIL) ? 'admin' : 'user';

                    user = await User.create({
                        name: profile.displayName,
                        email: email,
                        avatar: profile.photos ? profile.photos[0].value : '',
                        provider: 'facebook',
                        providerId: profile.id,
                        role
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    ));
}
