import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    category: { type: String, required: true, trim: true },
    items: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
