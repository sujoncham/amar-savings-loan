const express = require("express");
const expenseController = require("./expenseController");

const routerExpense = express.Router();

// Route to get all expenses
routerExpense.get("/", expenseController.getAllExpenses);

// Route to get a single expense by ID
routerExpense.get("/:id", expenseController.getExpenseById);

// Route to create a new expense
routerExpense.post("/addExpense", expenseController.createExpense);

// Route to update an existing expense by ID
routerExpense.put("/:id", expenseController.updateExpense);

// Route to delete an expense by ID
routerExpense.delete("/:id", expenseController.deleteExpense);

module.exports = routerExpense;
