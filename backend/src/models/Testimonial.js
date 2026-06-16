import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    avatar: {
        type: String // URL to image
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
