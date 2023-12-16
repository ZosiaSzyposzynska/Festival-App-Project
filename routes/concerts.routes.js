const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

router.get('/', (req, res) => {

  res.json(db.concerts);

});
router.get('/:id', (req, res) => {
  const concert = db.concerts.find(item => item.id === parseInt(req.params.id));

  if (concert) {
    res.json(concert);
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

router.post('/', (req, res) => {
  const { performer, genre, price, day, image } = req.body;

  if (performer && genre && price && day && image) {
    const newConcert = { id: uuidv4(), performer, genre, price, day, image };
    db.concerts.push(newConcert);
    res.json({ message: 'OK' });
  } else {
    res.status(400).json({ message: 'Bad request. Missing required fields in request body.' });
  }
});

router.put('/:id', (req, res) => {
  const concert = db.concerts.find(item => item.id === parseInt(req.params.id));

  if (concert) {
    const { performer, genre, price, day, image } = req.body;

    if (performer && genre && price && day && image) {
      concert.performer = performer;
      concert.genre = genre;
      concert.price = price;
      concert.day = day;
      concert.image = image;
      res.json({ message: 'OK' });
    } else {
      res.status(400).json({ message: 'Bad request. Missing required fields in request body.' });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

router.delete('/:id', (req, res) => {
  const index = db.concerts.findIndex(item => item.id === parseInt(req.params.id));

  if (index !== -1) {
    db.concerts.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;
