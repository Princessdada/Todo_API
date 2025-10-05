const express = require("express");
const taskController = require("../controllers/taskcontroller");

const taskRouter = express.Router();

taskRouter.get("/", taskController.getAllTasks);
taskRouter.get("/:id", taskController.getTaskById);
taskRouter.post("/", taskController.addTasks);
taskRouter.patch("/:id", taskController.updateTasks);
taskRouter.delete("/:id", taskController.deleteTasks);

module.exports = taskRouter;
