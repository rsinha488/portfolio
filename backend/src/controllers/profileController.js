import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            // Create a default profile if none exists
            profile = await Profile.create({
                name: "Your Name",
                title: "Portfolio Title",
                bio: "Tell something about yourself.",
                avatar: ""
            });
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (profile) {
            profile = await Profile.findByIdAndUpdate(profile._id, req.body, { new: true });
        } else {
            profile = await Profile.create(req.body);
        }
        res.json(profile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
