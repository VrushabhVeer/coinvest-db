const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const { validationResult } = require("express-validator");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const userRouter = Router();

// Signup
userRouter.post("/signup", async (req, res) => {
  try {
    // Validate user inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, dob, gender, password, country } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      dob,
      gender,
      password: hash,
      country,
    });
    await newUser.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again" });
  }
});

//get user
userRouter.get("/user_details/:id", async (req, res) => {
  try {
    const result = await UserModel.findOne({ _id: req.params.id });
    res.send(result);
  } catch (error) {
    res.json({ message: "Error: " + error.message });
  }
});

// Update User Account
userRouter.put("/update/:id", async (req, res) => {
  try {
    const { name, email, dob, gender, password, country } = req.body;
    const updatedUser = {
      name,
      email,
      dob,
      gender,
      password,
      country,
    };

    // You may want to add validation and error handling here for updating the user data
    const result = await UserModel.findByIdAndUpdate(
      req.params.id,
      updatedUser,
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User account updated successfully",
      updatedUser: result,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again" });
  }
});

// Delete User Account
userRouter.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User account deleted successfully", deletedUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again" });
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Login failed" });
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(400).json({ message: "Login failed" });
    }

    const token = jwt.sign(
      { userId: user._id, userName: user.name },
      SECRET_KEY
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      userName: user.name,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again" });
  }
});

module.exports = {
  userRouter,
};
