const mongoose = require("mongoose");

// Mongoose schema
const PersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    savings: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Person", PersonSchema);
