const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
res.send("Organizr backend is running!");
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
