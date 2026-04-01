// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Use environment variable for MongoDB URI for safety
// Example: MONGO_URI="mongodb+srv://username:password@cluster0.mongodb.net/dbname"
const MONGO_URI = process.env.MONGO_URI || "mongodb://25BCNB44:sgupta2113@ac-ootxgn9-shard-00-00.xgos1fg.mongodb.net:27017,ac-ootxgn9-shard-00-01.xgos1fg.mongodb.net:27017,ac-ootxgn9-shard-00-02.xgos1fg.mongodb.net:27017/?ssl=true&replicaSet=atlas-bcbmf5-shard-0&authSource=admin&appName=Cluster0";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error ❌", err));

// Task Schema
const taskSchema = new mongoose.Schema(
  { title: { type: String, required: true } },
  { timestamps: true } // optional: adds createdAt and updatedAt
);

const Task = mongoose.model("Task", taskSchema);

// Routes

// Health check
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ _id: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a new task
app.post("/add-task", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const newTask = new Task({ title });
    await newTask.save();
    res.json({ message: "Task added ✅", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a task by ID
app.delete("/delete-task/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found ❌" });
    res.json({ message: "Task deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
