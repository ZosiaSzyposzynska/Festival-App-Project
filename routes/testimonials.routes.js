const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

router.get('/', (req, res) => {

  res.json(db.testimonials);

});


router.get('/:id', (req, res) => {
  const testimonial = db.testimonials.find(item => item.id === parseInt(req.params.id));

  if (testimonial) {
    res.json(testimonial);
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

router.get('/random', (req, res) => {
  const randomTestimonial = db.testimonials[Math.floor(Math.random() * db.testimonials.length)];
  res.json(randomTestimonial);
});

router.post('/', (req, res) => {
  const { author, text } = req.body;

  if (author && text) {
    const newTestimonial = { id: uuidv4(), author, text };
    db.testimonials.push(newTestimonial);
    res.json({ message: 'OK' });
  } else {
    res.status(400).json({ message: 'Bad request. Missing author or text in request body.' });
  }
});

router.put('/:id', (req, res) => {
  const testimonial = db.testimonials.find(item => item.id === parseInt(req.params.id));

  if (testimonial) {
    const { author, text } = req.body;

    if (author && text) {
      testimonial.author = author;
      testimonial.text = text;
      res.json({ message: 'OK' });
    } else {
      res.status(400).json({ message: 'Bad request. Missing author or text in request body.' });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

router.delete('/:id', (req, res) => {
  const index = db.testimonials.findIndex(item => item.id === parseInt(req.params.id));

  if (index !== -1) {
    db.testimonials.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;
