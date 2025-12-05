import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String, // Markdown or HTML content
    },
    images: [{
        url: String,
        publicId: String, // For Cloudinary
        alt: String
    }],
    technologies: [{
        type: String
    }],
    liveUrl: String,
    githubUrl: String,
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to generate slug from title if not provided
projectSchema.pre('save', function (next) {
    if (!this.isModified('title') || this.slug) {
        return next();
    }
    this.slug = this.title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
