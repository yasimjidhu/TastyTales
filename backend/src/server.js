require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Connect = require('./config/db')
const userRoutes = require("../src/routes/userRoutes");
const recipeRoutes = require("../src/routes/recipeRoutes");

const app = express();
app.use(express.json());
app.use(cors());

Connect()

// Simple Route
app.get("/", (req, res) => {
  res.send("Recipe App Backend is Running! request recieved",req.url);
});

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
