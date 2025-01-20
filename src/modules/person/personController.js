const Person = require("./personModel");

exports.getPerson = async (req, res) => {
  try {
    const persons = await Person.find();
    res.status(200).json({
      status: "success",
      data: persons,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.addOwner = async (req, res) => {
  console.log(req.body);
  try {
    //create
    const result = new Person({
      name: req.body.name,
    });

    const data = await result.save();
    res.status(200).json({
      status: "success",
      message: "created owner successfull",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "not inserted",
      error: error.message,
    });
  }
};

exports.addSavings = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const person = await Person.findByIdAndUpdate(
    id,
    { $inc: { savings: amount } },
    { new: true } // Return the updated document
  );
  res.json(person); // Send the updated person back
};

exports.editSavings = async (req, res) => {
  // console.log(req.body);
  const { savings, name } = req.body;
  const { id } = req.params;

  try {
    const person = await Person.findByIdAndUpdate(
      id,
      { $set: { savings, name } },
      { new: true }
    );
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteSavings = async (req, res) => {
  const { id } = req.params;

  try {
    await Person.findByIdAndDelete(id);
    return res.status(200).json({
      status: "success",
      message: "person deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
