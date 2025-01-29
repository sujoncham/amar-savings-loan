const Donation = require("./othersModel");

// Get Donation Summary
exports.getSummary = async (req, res) => {
  try {
    const donation = await Donation.findOne();
    if (!donation) {
      return res.status(404).json({ message: "No donation data found." });
    }
    res.status(200).json({
      status: "success",
      data: {
        totalCollection: donation.totalCollection,
        totalDonated: donation.totalDonated,
        donationHistory: donation.donationHistory,
        collectionHistory: donation.collectionHistory,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add to Total Collection
exports.addCollection = async (req, res) => {
  console.log(req.body);
  try {
    const { amount, title, note } = req.body;

    let donation = await Donation.findOne();
    if (!donation) {
      return res.status(404).json({ message: "No donation data found." });
    }

    if (donation.totalCollection < amount) {
      return res.status(400).json({ message: "Insufficient funds." });
    }

    donation.totalCollection += amount;
    donation.collectionHistory.push({ title, amount, note });
    await donation.save();

    res.status(200).json({
      status: "success",
      data: {
        totalCollection: donation.totalCollection,
        collectionHistory: donation.collectionHistory,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding collection", error });
  }
};

// Deduct Donation Amount
exports.deductDonation = async (req, res) => {
  try {
    const { title, amount, note } = req.body;

    let donation = await Donation.findOne();
    if (!donation) {
      return res.status(404).json({ message: "No donation data found." });
    }

    if (donation.totalCollection < amount) {
      return res.status(400).json({ message: "Insufficient funds." });
    }

    donation.totalCollection -= amount;
    donation.totalDonated += amount;
    donation.donationHistory.push({ title, amount, note });

    await donation.save();
    res.status(200).json({
      status: "success",
      data: {
        totalCollection: donation.totalCollection,
        totalDonated: donation.totalDonated,
        donationHistory: donation.donationHistory,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error deducting donation", error });
  }
};

exports.DonatedHistoryEdit = async (req, res) => {
  const { id } = req.params;
  const { title, amount, note } = req.body;

  try {
    const donation = await Donation.findOne();
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    const historyItem = donation.donationHistory.id(id);
    if (!historyItem)
      return res.status(404).json({ message: "Donation history not found" });

    // Adjust the totalDonatedAmount
    const difference = amount - historyItem.amount;
    donation.totalDonated += difference;

    // Update the specific history item
    historyItem.title = title;
    historyItem.amount = amount;
    historyItem.note = note;

    await donation.save();

    res.json({ message: "Donation updated successfully", data: donation });
  } catch (error) {
    res.status(500).json({ message: "Failed to update donation", error });
  }
};

exports.collectionHistoryEdit = async (req, res) => {
  const { id } = req.params;
  const { title, amount, note } = req.body;

  try {
    const donation = await Donation.findOne();
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    const historyItem = donation.collectionHistory.id(id);
    if (!historyItem)
      return res.status(404).json({ message: "Donation history not found" });

    // Adjust the totalDonatedAmount
    const difference = amount + historyItem.amount;
    donation.totalCollection += difference;

    // Update the specific history item
    historyItem.title = title;
    historyItem.amount = amount;
    historyItem.note = note;

    await donation.save();

    res.json({ message: "Donation updated successfully", data: donation });
  } catch (error) {
    res.status(500).json({ message: "Failed to update donation", error });
  }
};

exports.DonatedHistoryEdit = async (req, res) => {
  const { id } = req.params;
  const { title, amount, note } = req.body;

  try {
    const donation = await Donation.findOne();
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    const historyItem = donation.donationHistory.id(id);
    if (!historyItem)
      return res.status(404).json({ message: "Donation history not found" });

    // Adjust the totalDonatedAmount
    const difference = amount - historyItem.amount;
    donation.totalDonated += difference;

    // Update the specific history item
    historyItem.title = title;
    historyItem.amount = amount;
    historyItem.note = note;

    await donation.save();

    res.json({ message: "Donation updated successfully", data: donation });
  } catch (error) {
    res.status(500).json({ message: "Failed to update donation", error });
  }
};

exports.donatedHistoryDelete = async (req, res) => {
  try {
    const { id } = req.params; // ID of the subdocument (donationHistory entry)

    // Find the donation document that contains this history entry
    const donationDoc = await Donation.findOne({ "donationHistory._id": id });

    if (!donationDoc) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Find the donation history entry to get the amount before deleting it
    const deletedEntry = donationDoc.donationHistory.id(id);
    if (!deletedEntry) {
      return res
        .status(404)
        .json({ message: "Donation history entry not found" });
    }

    const deletedAmount = deletedEntry.amount; // Store the amount before deletion

    // Remove the specific history item
    donationDoc.donationHistory.pull({ _id: id });

    // Adjust the totalDonatedAmount (refund the deleted amount)
    donationDoc.totalCollection += deletedAmount;
    donationDoc.totalDonated -= deletedAmount;

    await donationDoc.save(); // Save the updated document

    res.json({
      message: "Donation deleted successfully, amount refunded",
      data: donationDoc,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete donation", error });
  }
};

exports.collectionHistoryDelete = async (req, res) => {
  try {
    const { id } = req.params; // ID of the subdocument (donationHistory entry)

    // Find the donation document that contains this history entry
    const donationDoc = await Donation.findOne({ "collectionHistory._id": id });

    if (!donationDoc) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Find the donation history entry to get the amount before deleting it
    const deletedEntry = donationDoc.collectionHistory.id(id);
    if (!deletedEntry) {
      return res
        .status(404)
        .json({ message: "Donation history entry not found" });
    }

    const deletedAmount = deletedEntry.amount; // Store the amount before deletion

    // Remove the specific history item
    donationDoc.collectionHistory.pull({ _id: id });

    // Adjust the totalDonatedAmount (refund the deleted amount)
    donationDoc.totalCollection -= deletedAmount;

    await donationDoc.save(); // Save the updated document

    res.json({
      message: "Donation deleted successfully, amount refunded",
      data: donationDoc,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete donation", error });
  }
};
