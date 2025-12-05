import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const startServer = async () => {
    try {
        if (!MONGO_URI) {
            console.warn('Warning: MONGO_URI is not defined in environment variables.');
        } else {
            await mongoose.connect(MONGO_URI);
            console.log('Connected to MongoDB');
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

startServer();
