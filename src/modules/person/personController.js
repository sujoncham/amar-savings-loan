const Person = require("./personModel");

exports.getPerson = async (req, res) => {
  const persons = await Person.find();
  res.json(persons);
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
  // try {
  //     const { id } = req.params;
  //     const { amount } = req.body;

  //     // Find the person by ID and update their savings
  //     const person = await Person.findByIdAndUpdate(id);
  //     if (!person) {
  //       return res.status(404).json({ message: "Person not found" });
  //     }

  //     // Update savings
  //     person.savings += amount;
  //     await person.save();

  //     res.status(200).json({ message: "Savings updated", person });
  //   } catch (error) {
  //     console.error("Error updating savings:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // };
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
  const { savings } = req.body;
  const { id } = req.params;

  try {
    const person = await Person.findByIdAndUpdate(
      id,
      { $set: { savings } },
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
