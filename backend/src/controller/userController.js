const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        return res.status(201).json({ user, message: "User registered successfully!" });
    } catch (error) {
        res.status(400).json({ error: "Email already exists" });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email,image:user.image } });
}

const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
}

const updateProfileImage = async (req, res) => {
    const { userId } = req.params;
    const { imageUri } = req.body;

    if (!imageUri) {
        return res.status(400).json({ error: "Image URI is required" });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, { image: imageUri }, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "Profile image updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile image" });
    }
}

const updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    const { name, phone } = req.body;
    // Validate that at least one field is provided
    if (!name && !phone) {
        return res.status(400).json({ error: "At least one field (name or phone) must be provided." });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;

    try {
        const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
};


module.exports = {
    register,
    login,
    updateProfileImage,
    getUserProfile,
    updateUserProfile
}