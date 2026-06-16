import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
    ipHash: {
        type: String,
        required: true
    },
    userAgent: {
        type: String
    }
}, { 
    timestamps: true 
});

// Create index for query performance on date ranges
visitSchema.index({ createdAt: -1 });

const Visit = mongoose.model('Visit', visitSchema);

export default Visit;
