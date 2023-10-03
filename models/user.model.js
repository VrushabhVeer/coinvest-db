const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  password: { type: String, required: true },
  country: { type: String, default: "India" },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  UserModel,
};
