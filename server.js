const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://25BCNB44:sgupta2113@ac-ootxgn9-shard-00-00.xgos1fg.mongodb.net:27017,ac-ootxgn9-shard-00-01.xgos1fg.mongodb.net:27017,ac-ootxgn9-shard-00-02.xgos1fg.mongodb.net:27017/?ssl=true&replicaSet=atlas-bcbmf5-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error ❌", err));

const taskSchema = new mongoose.Schema({ title: String });
const Task = mongoose.model("Task", taskSchema);

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ _id: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/add-task", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const newTask = new Task({ title });
    await newTask.save();
    res.json({ message: "Task added", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete("/delete-task/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/", (req, res) => res.send("Backend running"));

app.listen(5000, () => console.log("Server running on port 5000 🚀"));
