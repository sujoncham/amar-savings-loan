const Donation = require("./donateModel");

// Add donation
exports.addDonation = async (req, res) => {
  console.log(req.body);
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount." });
  }

  try {
    let donationData = await Donation.findOne();
    if (!donationData) {
      donationData = new Donation({ totalCollection: 0, totalDonated: 0 });
    }

    donationData.totalCollection += amount;
    await donationData.save();

    res.status(200).json(donationData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deduct donation (spend)
exports.deductDonation = async (req, res) => {
  console.log(req.body);
  const { title, amount, note } = req.body;

  if (!title || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid data provided." });
  }

  try {
    let donationData = await Donation.findOne();
    if (!donationData) {
      return res.status(404).json({ message: "No donation data found." });
    }

    donationData.totalDonated += amount;
    donationData.donationHistory.push({ title, amount, note });

    await donationData.save();
    res.status(200).json(donationData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch summary
exports.getSummary = async (req, res) => {
  try {
    const donationData = await Donation.findOne();
    if (!donationData) {
      return res.status(404).json({
        status: "success",
        data: {
          totalCollection: 0,
          totalDonated: 0,
          donationHistory: [],
        },
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        totalCollection: donationData.totalCollection,
        totalDonated: donationData.totalDonated,
        donationHistory: donationData.donationHistory,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
