const BlogModel = require("./blogModel");

exports.addBlog = async (req, res) => {
  // console.log(req.body);
  try {
    const { title, content } = req.body;

    // Cloudinary stores the file and provides a URL
    const imageUrl = req.file?.path; // File path in Cloudinary

    // Mock database save (replace with actual DB code)
    const newBlog = {
      title,
      content,
      image: imageUrl,
    };

    const blog = new BlogModel(newBlog).save();

    res.status(201).json({
      message: "Blog added successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error uploading blog:", error);
    res.status(500).json({ error: "Failed to add blog" });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    let { page = 1, limit = 9, type } = req.query; // Default limit is 9 for the blog page
    page = parseInt(page);
    limit = parseInt(limit);

    if (type === "home") {
      // Fetch only 6 latest blogs for the home page
      const latestBlogs = await BlogModel.find()
        .sort({ createdAt: -1 })
        .limit(6);

      return res.json({
        success: true,
        data: latestBlogs,
      });
    }

    // Fetch paginated blogs for the blog page
    const totalBlogs = await BlogModel.countDocuments();
    const paginatedBlogs = await BlogModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: paginatedBlogs,
      totalPages: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({
      status: "success",
      message: "Blog get by id successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const blog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({
      status: "success",
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
