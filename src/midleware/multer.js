const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogs", // Folder in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file types
  },
});

const upload = multer({ storage });

module.exports = upload;
