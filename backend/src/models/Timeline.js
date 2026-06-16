import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['experience', 'education'],
        default: 'experience'
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Timeline = mongoose.model('Timeline', timelineSchema);

export default Timeline;
