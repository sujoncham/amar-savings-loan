const Loan = require("./loanModel");

// Add New Loan
exports.addLoan = async (req, res) => {
  console.log("Received body:", req.body);

  try {
    const { name, totalLoan } = req.body;

    // Validate required fields
    if (!name || !totalLoan) {
      return res
        .status(400)
        .json({ message: "Name and total loan amount are required." });
    }

    // Calculate the total interest (5% of the total loan)
    const totalInterest = (totalLoan * 5) / 100;

    const loan = new Loan({
      name,
      totalLoan,
      remainingLoan: totalLoan,
      totalInterest,
      remainingInterest: totalInterest,
      history: [],
    });

    const savedLoan = await loan.save();
    res.status(201).json(savedLoan);
  } catch (error) {
    res.status(500).json({ message: "Failed to add loan", error });
  }
};

// Get All Loans
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch loans", error });
  }
};

exports.deductLoanPayment = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const { partialPayment, interestPayment } = req.body;

    // Validate input
    if (partialPayment < 0 || interestPayment < 0) {
      return res
        .status(400)
        .json({ message: "Payments must be non-negative values." });
    }

    // Find the loan by ID
    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }

    // Validate that payments do not exceed remaining values
    if (partialPayment > loan.remainingLoan) {
      return res
        .status(400)
        .json({ message: "Loan payment exceeds remaining loan." });
    }
    if (interestPayment > loan.remainingInterest) {
      return res
        .status(400)
        .json({ message: "Interest payment exceeds remaining interest." });
    }

    // Deduct the payments
    loan.remainingLoan -= partialPayment;
    loan.remainingInterest -= interestPayment;

    // Add the transaction to the history
    loan.history.push({
      date: new Date(),
      amountPaid: partialPayment,
      interestAdded: interestPayment,
      remainingLoan: loan.remainingLoan,
      remainingInterest: loan.remainingInterest,
    });

    // Save the updated loan
    const updatedLoan = await loan.save();

    res.status(200).json(updatedLoan);
  } catch (error) {
    console.error("Error deducting payment:", error);
    res.status(500).json({ message: "Failed to deduct payment", error });
  }
};

exports.editLoans = async (req, res) => {
  console.log(req.body);
  const { totalLoan } = req.body;
  const { id } = req.params;

  try {
    const loan = await Loan.findByIdAndUpdate(
      id,
      { $set: { totalLoan } },
      { new: true }
    );
    if (!loan) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
