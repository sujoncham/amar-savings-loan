const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to the database");
  } catch (error) {
    console.log("Failed to connect to the database", error);
  }
};

module.exports = connectDB;
