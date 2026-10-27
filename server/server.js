const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Task = require("./models/Task");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
res.send("Organizr backend is running!");
});

// REGISTER USER
app.post("/api/auth/register", async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        // Validate required fields
        if (
            !fullName?.trim() ||
            !email?.trim() ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: "All fields are required.",
            });
        }

        // Validate email format
        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address.",
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match.",
            });
        }

        // Check whether the email is already registered
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists.",
            });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Registration successful! You can now log in.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        // Handle duplicate email indexes, including concurrent requests
        if (error.code === 11000) {
            return res.status(409).json({
                message: "An account with this email already exists.",
            });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Registration failed. Please try again.",
        });
    }
});


// LOGIN USER
app.post("/api/auth/login", async (req, res) => {
    console.log("Login Route Hit");
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        // Explicitly include the password hash for verification
        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from the server environment.");

            return res.status(500).json({
                message: "Authentication is not configured correctly.",
            });
        }

        // Create an authentication token
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Login failed. Please try again.",
        });
    }
});

// GET all tasks, with optional search
app.get("/api/tasks", async (req, res) => {
try {
const { search } = req.query;
let filter = {};


    if (search && search.trim()) {
        const regex = new RegExp(
            search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "i"
        );

        filter = {
            $or: [
                { title: regex },
                { description: regex },
            ],
        };
    }

    const tasks = await Task.find(filter).sort({ due_date: 1 });
    res.json(tasks);
} catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks." });
}


});

// GET one task
app.get("/api/tasks/:id", async (req, res) => {
try {
if (!mongoose.isValidObjectId(req.params.id)) {
return res.status(400).json({ message: "Invalid task ID." });
}


    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ message: "Task not found." });
    }

    res.json(task);
} catch (error) {
    res.status(500).json({ message: "Failed to fetch task." });
}


});

// CREATE a task
app.post("/api/tasks", async (req, res) => {
try {
const { title, description, due_date } = req.body;


    if (!title?.trim() || !description?.trim()) {
        return res.status(400).json({
            message: "Title and description are required.",
        });
    }

    const task = await Task.create({
        title: title.trim(),
        description: description.trim(),
        due_date: due_date || null,
    });

    res.status(201).json(task);
} catch (error) {
    res.status(400).json({ message: "Failed to create task." });
}


});

// UPDATE a task
app.put("/api/tasks/:id", async (req, res) => {
try {
if (!mongoose.isValidObjectId(req.params.id)) {
return res.status(400).json({ message: "Invalid task ID." });
}


    const { title, description, due_date } = req.body;

    if (!title?.trim() || !description?.trim()) {
        return res.status(400).json({
            message: "Title and description are required.",
        });
    }

    const task = await Task.findByIdAndUpdate(
        req.params.id,
        {
            title: title.trim(),
            description: description.trim(),
            due_date: due_date || null,
        },
        { new: true, runValidators: true }
    );

    if (!task) {
        return res.status(404).json({ message: "Task not found." });
    }

    res.json(task);
} catch (error) {
    res.status(400).json({ message: "Failed to update task." });
}


});

// DELETE a task
app.delete("/api/tasks/:id", async (req, res) => {
try {
if (!mongoose.isValidObjectId(req.params.id)) {
return res.status(400).json({ message: "Invalid task ID." });
}


    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
        return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task deleted successfully." });
} catch (error) {
    res.status(500).json({ message: "Failed to delete task." });
}


});

// Start server after MongoDB connects
async function startServer() {
try {
await mongoose.connect(process.env.MONGODB_URI);
console.log("MongoDB connected successfully!");


    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
}

}

startServer();
