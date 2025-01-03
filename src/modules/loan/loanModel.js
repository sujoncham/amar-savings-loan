const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalLoan: { type: Number, required: true },
  remainingLoan: { type: Number, required: true },
  totalInterest: { type: Number, required: true },
  remainingInterest: { type: Number, required: true },
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
// Validation for negative remaining values
loanSchema.pre("save", function (next) {
  if (this.remainingLoan < 0) {
    return next(new Error("Remaining loan cannot be negative."));
  }
  if (this.remainingInterest < 0) {
    return next(new Error("Remaining interest cannot be negative."));
  }
  next();
});

const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
