const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ------------------ Register ------------------

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        
        await user.save();

        res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, message: "User registered successfully!" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Registration failed" });
    }
};

// ------------------ Login ------------------

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
};

// ------------------ Get User Profile ------------------

const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select("-password").lean();
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
};

// ------------------ Update Profile Image ------------------

const updateProfileImage = async (req, res) => {
    const { userId } = req.params;
    const { imageUri } = req.body;

    if (!imageUri) {
        return res.status(400).json({ error: "Image URI is required" });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, { image: imageUri }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ message: "Profile image updated successfully", user });
    } catch (error) {
        console.error("Error updating profile image:", error);
        res.status(500).json({ error: "Failed to update profile image" });
    }
};

// ------------------ Update Profile ------------------

const updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    const { name, phone } = req.body;

    if (!name && !phone) {
        return res.status(400).json({ error: "At least one field (name or phone) is required" });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;

    try {
        const user = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

// ------------------ Exports ------------------

module.exports = {
    register,
    login,
    getUserProfile,
    updateProfileImage,
    updateUserProfile
};
