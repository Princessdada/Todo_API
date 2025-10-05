const Tasks = require("../model/task");
const mongoose = require("mongoose");
async function getAllTasks(req, res) {
  try {
    const { status, sort, order, limit } = req.query;

    //    build a state filter
    let filter = { userId: req.user.id };
    if (status) {
      filter.status = status;
    }
    let query = Tasks.find(filter);

    // if sorting is provided
    if (sort) {
      query = query.sort({ [sort]: order === "desc" ? -1 : 1 });
    }
    // limiting
    if (limit) {
      query = query.limit(Number(limit));
    }
    const tasks = await query;
    res.render("tasks", { tasks, message: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTaskById(req, res) {
  try {
    const id = req.params.id;
    // Check if it is a monogoose valid id
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }
    const tasks = await Tasks.findOne({ _id: id, userId: req.user.id });
    if (!tasks) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function addTasks(req, res) {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      // Get all tasks and render with error message
      const tasks = await Tasks.find({ userId: req.user.id });
      return res.render("tasks", {
        tasks,
        message: "Title field is empty",
      });
    }
    // validate status input
    const validStatuses = ["pending", "completed", "deleted"];
    if (status && !validStatuses.includes(status)) {
      const tasks = await Tasks.find({ userId: req.user.id });
      return res.render("tasks", {
        tasks,
        message: "Invalid status value",
      });
    }
    const newTask = new Tasks({
      title,
      description: description || "",
      status: status || "pending",
      userId: req.user.id,
    });
    await newTask.save();

    // Get all tasks and render with success message
    const tasks = await Tasks.find({ userId: req.user.id });
    return res.render("tasks", {
      tasks,
      message: "Task added successfully!",
    });
  } catch (err) {
    const tasks = await Tasks.find({ userId: req.user.id }).catch(() => []);
    return res.render("tasks", {
      tasks,
      message: "Error adding task: " + err.message,
    });
  }
}
async function updateTasks(req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    const { title, description, status } = req.body;
    const validStatuses = ["pending", "completed", "deleted"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTask = await Tasks.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, description, status },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}

async function deleteTasks(req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    const task = await Tasks.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!task) {
      res.status(404).json({
        message: "ID Not Found",
      });
    }
    return res.status(200).json({ message: "deleted sucessfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  addTasks,
  updateTasks,
  deleteTasks,
};
