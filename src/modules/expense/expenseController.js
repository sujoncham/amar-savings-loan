const Expense = require("./expenseModel");

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json({
      status: "success",
      results: expenses.length,
      data: expenses,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        status: "fail",
        message: "No expense found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        expense,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Create new expense
exports.createExpense = async (req, res) => {
  console.log(req.body);
  try {
    const { title, expense, note } = req.body;

    // Mock database save (replace with actual DB code)
    const newExpense = {
      title,
      expense,
      note,
    };

    const expen = new Expense(newExpense).save();

    res.status(201).json({
      message: "Expense added successfully",
      data: expen,
    });
  } catch (error) {
    console.error("Error uploading blog:", error);
    res.status(500).json({ error: "Failed to add blog" });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!expense) {
      return res.status(404).json({
        status: "fail",
        message: "No expense found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        expense,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({
        status: "fail",
        message: "No expense found with that ID",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
