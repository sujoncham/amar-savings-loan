const User = require("./userModel");

const bcrypt = require("bcrypt");

const generateUserId = (name) => {
  const letters = name.substring(0, 3).toUpperCase(); // First three letters of the name
  const numbers = Math.floor(100 + Math.random() * 900); // Random three-digit number
  return `${letters}${numbers}`;
};

exports.signin = async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Find the user by userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Signin successful", userId });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error });
  }
};

exports.signup = async (req, res) => {
  console.log(req.body);
  const { name, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate a unique user ID
    const userId = generateUserId(name);

    // Create a new user
    const newUser = new User({ name, userId, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

exports.updateUserName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name }, // Only update the `name` field
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
