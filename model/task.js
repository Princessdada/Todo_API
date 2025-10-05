const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TaskModel = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: [500, "Description must not exceed 500 characters"],
  },
  status: {
    type: String,
    enum: ["pending", "completed", "deleted"],
    default: "pending",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdateAt: {
    type: Date,
    default: Date.now,
  },
});
// updates lastupdate whenever a task is modified
TaskModel.pre("save", function (next) {
  this.lastUpdateAt = Date.now();
  next();
});
module.exports = mongoose.model("Tasks", TaskModel);
