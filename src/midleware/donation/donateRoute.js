const express = require("express");
const {
  addDonation,
  getSummary,
  deductDonation,
  editDonatedAmount,
  deleteDonatedAmount,
} = require("./donateController");
const routerDonate = express.Router();

routerDonate.get("/", getSummary);
routerDonate.post("/addDonation", addDonation);
routerDonate.put("/:id", editDonatedAmount);
routerDonate.post("/deductDonation", deductDonation);
routerDonate.delete("/:id", deleteDonatedAmount);

module.exports = routerDonate;
