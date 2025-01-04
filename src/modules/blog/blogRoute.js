const express = require("express");
const {
  getBlogs,
  addBlog,
  getById,
  update,
  deleteBlog,
} = require("./blogController");
const upload = require("../../config/multerCloudinary");

const routerBlog = express.Router();
// Define routes
routerBlog.get("/", getBlogs);
routerBlog.post("/addBlog", upload.single("image"), addBlog);
routerBlog.get("/:id", getById);
routerBlog.put("/:id", update);
routerBlog.delete("/:id", deleteBlog);

module.exports = routerBlog;
