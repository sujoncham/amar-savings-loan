const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    totalCollection: {
      type: Number,
      required: true,
      default: 0,
    },
    collectionHistory: [
      {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
    totalDonated: {
      type: Number,
      required: true,
      default: 0,
    },
    donationHistory: [
      {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Donation = mongoose.model("donation", donationSchema);

module.exports = Donation;
