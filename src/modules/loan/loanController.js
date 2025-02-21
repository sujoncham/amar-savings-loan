const Loan = require("./loanModel");

const Person = require("../person/personModel");

// Function to generate unique non-member ID
const generateNonMemberId = async () => {
  const year = new Date().getFullYear(); // Get current year (e.g., 2025)

  // Find the latest non-member ID in the database
  const latestLoan = await Loan.findOne(
    { nonMemberId: { $regex: `^NM${year}` } }, // Find non-member IDs for the current year
    {},
    { sort: { nonMemberId: -1 } } // Sort descending to get the latest
  );

  let nextNumber = 1; // Default to 0001 if no previous ID exists

  if (latestLoan && latestLoan.nonMemberId) {
    // Extract the last 4 digits and increment
    const lastNumber = parseInt(latestLoan.nonMemberId.slice(-4), 10);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  // Format with leading zeros (e.g., 0001, 0010, 0123)
  const formattedNumber = String(nextNumber).padStart(4, "0");

  return `NM${year}${formattedNumber}`;
};

// Add New Loan
exports.addLoan = async (req, res) => {
  console.log("Received body:", req.body);

  try {
    const { name, totalLoan, referName, recieveDate } = req.body;

    // Validate required fields
    if (!name || !totalLoan) {
      return res
        .status(400)
        .json({ message: "Name and total loan amount are required." });
    }

    // Check if the person is a registered member
    const member = await Person.findOne({ name });

    let memberId = null;
    let nonMemberId = null;

    if (member) {
      memberId = member.memberId; // Assign memberId if found
    } else {
      nonMemberId = await generateNonMemberId(); // Generate nonMemberId if not a member
    }

    // Calculate the total interest (5% of the total loan)
    const totalInterest = (totalLoan * 5) / 100;

    // Create loan entry
    const loan = new Loan({
      name,
      memberId, // Either memberId or nonMemberId will be assigned
      nonMemberId,
      totalLoan,
      remainingLoan: totalLoan,
      totalInterest,
      remainingInterest: totalInterest,
      history: [],
      recieveDate,
      referName,
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
  const { totalLoan, name, note, referName } = req.body;
  const { id } = req.params;

  try {
    // Ensure we find only registered members
    const member = await Person.findOne({
      name: { $regex: `^${name}$`, $options: "i" }, // Case-insensitive exact match
      memberId: { $exists: true }, // Only fetch if memberId exists
    });

    let memberId = null;
    let nonMemberId = null;

    if (member) {
      memberId = member.memberId; // Assign existing memberId
    } else {
      // Only generate nonMemberId if no memberId exists
      const existingLoan = await Loan.findById(id);
      if (!existingLoan?.memberId) {
        nonMemberId = await generateNonMemberId();
      }
    }

    // Update the loan
    const loan = await Loan.findByIdAndUpdate(
      id,
      {
        $set: {
          totalLoan,
          name,
          note,
          referName,
          memberId: memberId || null, // Ensure it does not overwrite with undefined
          nonMemberId: nonMemberId || null, // Only assign if it's a non-member
        },
      },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    res.status(200).json(loan);
  } catch (error) {
    console.error("Error updating loan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete expense
exports.delLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) {
      return res.status(404).json({
        status: "fail",
        message: "No loan found with that ID",
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

exports.updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id);

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    // Toggle the status
    loan.status = loan.status === "pending" ? "completed" : "pending";

    await loan.save();

    res.json({ message: "Loan status updated", loan });
  } catch (error) {
    res.status(500).json({ message: "Failed to update loan status", error });
  }
};
