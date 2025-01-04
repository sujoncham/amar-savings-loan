const mongoose = require("mongoose");
require("dotenv").config();

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sxziar2.mongodb.net/my-savings?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("connected to the database");
  } catch (error) {
    console.log("Failed to connect to the database", error);
  }
};

module.exports = connectDB;
