const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  addTestimonial,
  getTestimonials,
  deleteTestimonial,
  getTestimonialById,
} = require("./testimonialController");

const routerTesti = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed."));
    }
  },
});

// Routes
routerTesti.post("/addTestimonial", upload.single("image"), addTestimonial);
routerTesti.get("/getTestimonials", getTestimonials);
routerTesti.get("/:id", getTestimonialById);
routerTesti.delete("/:id", deleteTestimonial);

module.exports = routerTesti;
