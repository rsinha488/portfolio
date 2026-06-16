import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
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
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String, // Markdown or HTML
        required: true
    },
    coverImage: {
        type: String
    },
    tags: [{
        type: String
    }],
    published: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

blogSchema.index({ slug: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ published: 1 });

// Pre-save middleware to generate slug
blogSchema.pre('save', function (next) {
    if (!this.isModified('title') || this.slug) {
        return next();
    }
    this.slug = this.title
        .toLowerCase()
        .replaceAll(/[^\w ]+/g, '')
        .replaceAll(/ +/g, '-');
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
