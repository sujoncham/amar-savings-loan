const express = require("express");
const {
  addDonation,
  getSummary,
  deductDonation,
} = require("./donateController");
const routerDonate = express.Router();

routerDonate.get("/", getSummary);
routerDonate.post("/addDonation", addDonation);
routerDonate.post("/deductDonation", deductDonation);
// routerDonate.put("/:id", updateDonate);
// routerDonate.delete("/:id", deleteDonate);

module.exports = routerDonate;
