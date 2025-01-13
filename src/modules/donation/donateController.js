const Donation = require("./donateModel");

// Add a new donation
exports.addDonation = async (req, res) => {
  console.log(req.body);
  const { amount } = req.body;
  try {
    const donation = new Donation({ amount });
    await donation.save();
    res.status(201).json({
      message: "Donation added successfully",
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding donation",
      error,
    });
  }
};

// Deduct donation amount
exports.makeDonation = async (req, res) => {
  const { id, title, deductAmount } = req.body;
  try {
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.amount < deductAmount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    donation.amount -= deductAmount;
    donation.title = title;
    await donation.save();

    res.status(200).json({
      message: "Donation deducted successfully",
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deducting donation",
      error,
    });
  }
};

// Fetch all donations
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json({ data: donations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

exports.updateDonate = async (req, res) => {
  try {
    const donate = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!donate) {
      return res.status(404).json({ message: "donate not found" });
    }
    return res.status(200).json({
      status: "success",
      message: "donate updated successfully",
      data: donate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDonate = async (req, res) => {
  try {
    const donate = await Donation.findByIdAndDelete(req.params.id);
    if (!donate) {
      return res.status(404).json({ message: "donate not found" });
    }
    res.status(200).json({ message: "donate deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
