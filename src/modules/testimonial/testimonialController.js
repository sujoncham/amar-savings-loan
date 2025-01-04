const Testimonial = require("./testimonialModel");

// Add a testimonial
const addTestimonial = async (req, res) => {
  try {
    const { text, name, role } = req.body;
    const image = req.file ? req.file.path : "";

    if (!text || !name || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newTestimonial = new Testimonial({
      text,
      name,
      role,
      image,
    });

    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add testimonial." });
  }
};

// Get all testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch testimonials." });
  }
};

// Get a testimonial by ID
const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found." });
    }

    res.status(200).json(testimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch testimonial." });
  }
};

// Delete a testimonial by ID
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found." });
    }

    res.status(200).json({ message: "Testimonial deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete testimonial." });
  }
};

module.exports = {
  addTestimonial,
  getTestimonials,
  getTestimonialById,
  deleteTestimonial,
};
