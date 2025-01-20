const express = require("express");
const routerLoan = express.Router();
const loanController = require("./loanController");

// Add Loan
routerLoan.post("/addLoan", loanController.addLoan);

// Get All Loans
routerLoan.get("/", loanController.getLoans);

// Deduct Loan Payment
routerLoan.put("/:id/deduct-payment", loanController.deductLoanPayment);
routerLoan.put("/:id/edit-loans", loanController.editLoans);
routerLoan.delete("/:id", loanController.delLoan);

module.exports = routerLoan;
