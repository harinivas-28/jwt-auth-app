const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());


const JWT_SECRET = "my_secret_key";
const saltRounds = 10;
const users = [];
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/authApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
  });
  
const User = mongoose.model("User", UserSchema);
  

// POST /auth/signup
app.post("/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
      }
  
      const hashedPwd = await bcrypt.hash(password, saltRounds);
      const newUser = new User({ name, email, password: hashedPwd });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
});
  

// POST /auth/login
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Invalid password" });
      }
  
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
});
  

// GET /auth/protected
app.get("/auth/protected", (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ message: `Hello ${decoded.name}, you accessed a protected route!` });
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});