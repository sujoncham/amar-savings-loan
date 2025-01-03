const express = require("express");
const userController = require("./userController");

const routerUser = express.Router();

// Route to get all users
routerUser.get("/", userController.getAllUsers);

// Route to get a single user by ID
routerUser.get("/:id", userController.getUserById);
routerUser.put("/:id", userController.updateUserName);

// Route to signup a new user
routerUser.post("/signup", userController.signup);
// Route to signin a new user
routerUser.post("/signin", userController.signin);

// Route to delete a user by ID
routerUser.delete("/:id", userController.deleteUser);

module.exports = routerUser;
