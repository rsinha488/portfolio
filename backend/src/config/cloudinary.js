import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Folder + transformation config per resource type
const UPLOAD_CONFIGS = {
    projects: {
        folder: 'portfolio/projects',
        transformation: [
            { width: 1200, height: 800, crop: 'fill', gravity: 'auto' },
            { fetch_format: 'auto', quality: 'auto:good' }
        ]
    },
    blogs: {
        folder: 'portfolio/blogs',
        transformation: [
            { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
            { fetch_format: 'auto', quality: 'auto:good' }
        ]
    },
    avatars: {
        folder: 'portfolio/avatars',
        transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { fetch_format: 'auto', quality: 'auto:good' }
        ]
    },
    thumbnails: {
        folder: 'portfolio/thumbnails',
        transformation: [
            { width: 600, height: 400, crop: 'fill', gravity: 'auto' },
            { fetch_format: 'auto', quality: 'auto:eco' }
        ]
    },
};

// Creates a multer upload instance for a given resource type
const createUpload = (type = 'projects') => {
    const config = UPLOAD_CONFIGS[type] ?? UPLOAD_CONFIGS.projects;
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: config.folder,
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            transformation: config.transformation,
        },
    });
    return multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    });
};

// Default upload (projects folder) — kept for backwards compatibility
const upload = createUpload('projects');

export { cloudinary, upload, createUpload, UPLOAD_CONFIGS };
