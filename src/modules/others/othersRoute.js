const express = require("express");
const {
  getSummary,
  addCollection,
  deductDonation,
  donatedHistoryDelete,
  DonatedHistoryEdit,
  collectionHistoryDelete,
  collectionHistoryEdit,
} = require("./othersController");

const routerDonated = express.Router();

routerDonated.get("/", getSummary);
routerDonated.post("/addCollection", addCollection);
routerDonated.post("/deductDonation", deductDonation);
routerDonated.put("/updateCollection/:id", collectionHistoryEdit);
routerDonated.delete("/deleteCollection/:id", collectionHistoryDelete);
routerDonated.put("/updateDonated/:id", DonatedHistoryEdit);
routerDonated.delete("/deleteDonated/:id", donatedHistoryDelete);

module.exports = routerDonated;
