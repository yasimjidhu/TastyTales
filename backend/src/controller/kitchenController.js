// controllers/kitchenController.js
const { default: mongoose } = require("mongoose");
const Kitchen = require("../models/kitchen");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

// Create kitchen
exports.createKitchen = async (req, res) => {
    try {
        console.log('Request body of createkitchen:', req.body);
        const { name } = req.body;
        const userId = req.user._id;

        const existingKitchen = await Kitchen.findOne({ "members.userId": userId });
        if (existingKitchen) {
            console.log('User already in a kitchen:', existingKitchen);
            return res.status(400).json({ error: "You already belong to a kitchen" });
        }

        const kitchen = await Kitchen.create({
            name,
            createdBy: userId,
            members: [{ userId: userId, role: "admin", userName: req.user.name }],
            inviteCode: uuidv4(), 
        });

        // also update the user
        await User.findByIdAndUpdate(userId, { kitchen: kitchen._id });

        console.log('Created kitchen:', kitchen);
        res.status(201).json({ kitchen });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Join kitchen via invite code
exports.joinKitchen = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const userId = req.user._id;

        console.log(`User ${userId} attempting to join kitchen with invite code: ${inviteCode}`);
        // Find the kitchen using invite code
        const kitchen = await Kitchen.findOne({ inviteCode });
        if (!kitchen) {
            return res.status(404).json({ error: "Invalid invite link" });
        }

        console.log('kitchen found for invitecode',kitchen)
        // Check if user already a member
        const alreadyMember = kitchen.members.some(
            (m) => m.userId.toString() === userId.toString()
        );
        console.log('alreadymember',alreadyMember)
        if (alreadyMember) {
            return res.status(400).json({ error: "Already a member" });
        }

        // Add as member
        kitchen.members.push({ userId: userId,userName: req.user.name, role: "member" });
        await kitchen.save();

        await User.findByIdAndUpdate(userId, { kitchen: kitchen._id });

        console.log(`User ${userId} joined kitchen ${kitchen._id}`);
        res.json({
            message: "Successfully joined kitchen",
            kitchen,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fetch kitchen details
exports.getKitchen = async (req, res) => {
    try {
        const { kitchenId } = req.params;
        console.log("Fetching kitchen with ID:", kitchenId);

        const kitchen = await Kitchen.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(kitchenId) } },

            // Lookup members with user details
            {
                $lookup: {
                    from: "users", // collection name in MongoDB
                    localField: "members.user",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },

            // Map members with their roles
            {
                $addFields: {
                    members: {
                        $map: {
                            input: "$members",
                            as: "m",
                            in: {
                                role: "$$m.role",
                                _id: "$$m._id",
                                user: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$userDetails",
                                                as: "ud",
                                                cond: { $eq: ["$$ud._id", "$$m.user"] },
                                            },
                                        },
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                },
            },

            // Clean up unwanted lookup field
            { $project: { userDetails: 0 } },
        ]);

        if (!kitchen || !kitchen.length)
            return res.status(404).json({ error: "Kitchen not found" });

        console.log("Fetched kitchen:", kitchen[0]);
        res.json({ kitchen: kitchen[0] });
    } catch (err) {
        console.error("Error fetching kitchen:", err);
        res.status(500).json({ error: err.message });
    }
};
