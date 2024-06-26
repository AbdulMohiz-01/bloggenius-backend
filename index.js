const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000; // Use 5000 as a fallback port
const MONGO_URI = process.env.MONGODB_URI;

const corsOptions = {
  origin: "*", // Replace with your frontend's origin
  credentials: true, // Allow credentials (cookies, etc.)
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB
console.log(typeof MONGO_URI);
console.log(PORT);
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!");
});

const blogRoutes = require("./routes/blogRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

app.use("/api", blogRoutes);
app.use("/api", userRoutes);
app.use("/health", (req, res) => {
  res.send("Service is healthy");
});

app.listen(PORT, () => {
  // log the server complete url
  console.log(`Server is running on http://localhost:${PORT}`);
});
