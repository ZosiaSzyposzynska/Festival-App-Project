
const Testimonial = require('../models/testimonials.model');


const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getTestimonialById = async (req, res) => {
  const { id } = req.params;

  try {
    const testimonial = await Testimonial.findById(id);

    if (testimonial) {
      res.json(testimonial);
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addTestimonial = async (req, res) => {
  const { author, text } = req.body;

  try {
    const newTestimonial = new Testimonial({ author, text });
    await newTestimonial.save();
    res.json({ message: 'OK' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;

  try {
    const testimonial = await Testimonial.findById(id);

    if (testimonial) {
      testimonial.author = author;
      testimonial.text = text;
      

      await testimonial.save();
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Testimonial.findByIdAndDelete(id);

    if (result) {
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllTestimonials,
  getTestimonialById,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
