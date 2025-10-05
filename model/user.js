const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
});

// hash password before saving to database
UserSchema.pre("save", async function (next) {
  // checks if password field is empty
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// method.isValidPassword creates method to check password validation
UserSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("users", UserSchema);
