const Message = require("./messagesModel");

exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Mock database save (replace with actual DB code)
    const newMess = {
      name,
      email,
      message,
    };

    const msg = new Message(newMess).save();

    res.status(201).json({
      message: "message added successfully",
      data: msg,
    });
  } catch (error) {
    console.error("Error uploading blog:", error);
    res.status(500).json({ error: "Failed to add blog" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const users = await Message.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.getMessageById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

exports.updateMessage = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    await Message.findByIdAndDelete(id);
    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
