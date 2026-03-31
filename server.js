const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://25BCNB44:sgupta2113@ac-ootxgn9-shard-00-00.xgos1fg.mongodb.net:27017,ac-ootxgn9-shard-00-01.xgos1fg.mongodb.net:27017,ac-ootxgn9-shard-00-02.xgos1fg.mongodb.net:27017/?ssl=true&replicaSet=atlas-bcbmf5-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error ❌", err));


// Schema
const taskSchema = new mongoose.Schema({
  title: String
});

const Task = mongoose.model("Task", taskSchema);

// Routes

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ _id: -1 });
  res.json(tasks);
});

// Add task
app.post("/add-task", async (req, res) => {
  const { title } = req.body;

  const newTask = new Task({ title });
  await newTask.save();

  res.json({ message: "Task added" });
});

// Delete task
app.delete("/delete-task/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});