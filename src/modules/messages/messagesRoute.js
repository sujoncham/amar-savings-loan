const express = require("express");
const messagesController = require("./messagesController");

const routerMessage = express.Router();

// Get all messages
routerMessage.get("/", messagesController.getMessages);

// Get a single message by ID
routerMessage.get("/:id", messagesController.getMessageById);

// Create a new message
routerMessage.post("/", messagesController.createMessage);

// Update a message by ID
routerMessage.put("/:id", messagesController.updateMessage);

// Delete a message by ID
routerMessage.delete("/:id", messagesController.deleteMessage);

module.exports = routerMessage;
