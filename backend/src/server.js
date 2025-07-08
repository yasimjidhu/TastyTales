require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Connect = require('./config/db')
const userRoutes = require("../src/routes/userRoutes");
const recipeRoutes = require("../src/routes/recipeRoutes");
const categoryRoutes = require('../src/routes/categoryRoutes')
const notificationRoutes = require('../src/routes/notificationRoutes')

const app = express();
app.use(express.json());
app.use(cors());

Connect()

// Simple Route
app.use("/", (req, res,next) => {
  console.log("Request received at", req.url);
  next()
});

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/category",categoryRoutes)
app.use("/api/notifications",notificationRoutes)

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
