const Person = require("./personModel");

let lastAssignedNumber = 0; // This resets when the server restarts

const generateMemberId = (name) => {
  const year = new Date().getFullYear();
  const letters = name.substring(0, 3).toUpperCase();

  lastAssignedNumber++; // Increment for each new member
  const formattedNumber = String(lastAssignedNumber).padStart(4, "0"); // Ensure 4-digit format

  return `${letters}${year}${formattedNumber}`;
};

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
  // console.log(req.body);
  try {
    const { name } = req.body;
    const memberId = await generateMemberId(name);

    //create
    const result = new Person({
      name,
      memberId,
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
  // console.log(req.body);
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const person = await Person.findByIdAndUpdate(
      id,
      { $inc: { savings: amount } },
      { new: true }
    );

    person.save();
    res.status(200).json({
      status: "success",
      message: "updated owner value successfull",
      data: person,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "not inserted",
      error: error.message,
    });
  }
};

exports.editSavings = async (req, res) => {
  // console.log(req.body);
  const { savings, name } = req.body;
  const { id } = req.params;
  const generateId = await generateMemberId(name);

  try {
    const person = await Person.findByIdAndUpdate(
      id,
      { $set: { savings, name, memberId: generateId } },
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
