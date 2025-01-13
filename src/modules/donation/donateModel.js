const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    title: { type: String, default: null }, // Title is optional initially
    amount: { type: Number, required: true }, // Amount is always required
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

module.exports = mongoose.model("Donation", donationSchema);
