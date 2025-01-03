const express = require("express");
const {
  addSavings,
  getPerson,
  addOwner,
  editSavings,
} = require("./personController");

const routerPerson = express.Router();

// Add a new post
routerPerson.get("/", getPerson);
routerPerson.post("/addOwner", addOwner);
routerPerson.put("/:id/add-money", addSavings);
routerPerson.put("/:id/edit-savings", editSavings);

module.exports = routerPerson;
