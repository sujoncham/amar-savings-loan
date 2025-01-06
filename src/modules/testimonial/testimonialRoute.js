const express = require("express");

const path = require("path");
const {
  addTestimonial,
  getTestimonials,
  deleteTestimonial,
  getTestimonialById,
} = require("./testimonialController");
const upload = require("../../config/multerCloudinary");

const routerTesti = express.Router();

// Routes
routerTesti.post("/addTestimonial", upload.single("image"), addTestimonial);
routerTesti.get("/getTestimonials", getTestimonials);
routerTesti.get("/:id", getTestimonialById);
routerTesti.delete("/:id", deleteTestimonial);

module.exports = routerTesti;
