const express = require("express");
const {
  addDonation,
  getDonations,
  makeDonation,
  updateDonate,
  deleteDonate,
} = require("./donateController");
const routerDonate = express.Router();

routerDonate.get("/", getDonations);
routerDonate.post("/addDonation", addDonation);
routerDonate.post("/deduct", makeDonation);
routerDonate.put("/:id", updateDonate);
routerDonate.delete("/:id", deleteDonate);

module.exports = routerDonate;
