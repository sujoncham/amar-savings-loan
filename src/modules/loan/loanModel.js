const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalLoan: { type: Number, required: true },
  remainingLoan: { type: Number, required: true },
  totalInterest: { type: Number, required: true },
  remainingInterest: { type: Number, required: true },
  recieveDate: { type: Date, default: Date.now },
  referName: { type: String },
  status: { type: String, enum: ["pending", "completed"], default: "pending" }, // ✅ Add status
  note: { type: String, default: "" }, // ✅ Add optional note
  history: [
    {
      date: { type: Date, default: Date.now },
      amountPaid: { type: Number, required: true },
      interestAdded: { type: Number, required: true },
      remainingLoan: { type: Number, required: true },
      remainingInterest: { type: Number, required: true },
    },
  ],
});

const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
