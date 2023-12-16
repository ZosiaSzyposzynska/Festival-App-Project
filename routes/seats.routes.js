// seats.routes.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.seats);
});

router.get('/:id', (req, res) => {
  const seat = db.seats.find(item => item.id === parseInt(req.params.id));

  if (seat) {
    res.json(seat);
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

router.post('/', (req, res) => {
  const { day, seat, client, email } = req.body;

  if (day && seat && client && email) {
    // Sprawdź, czy miejsce jest już zajęte na wybrany dzień
    const isSeatTaken = db.seats.some(item => item.seat === seat && item.day === day);

    if (isSeatTaken) {
      // Miejsce jest już zajęte, zwróć odpowiedni komunikat i status HTTP 409 Conflict
      res.status(409).json({ message: 'The slot is already taken...' });
    } else {
      // Miejsce jest dostępne, zarezerwuj je
      const newSeat = { id: uuidv4(), day, seat, client, email };
      db.seats.push(newSeat);
      res.json({ message: 'OK' });
    }
  } else {
    // Niepoprawne dane w żądaniu, zwróć odpowiedni komunikat i status HTTP 400 Bad Request
    res.status(400).json({ message: 'Bad request. Missing required fields in request body.' });
  }
});

router.put('/:id', (req, res) => {
  const seat = db.seats.find(item => item.id === parseInt(req.params.id));

  if (seat) {
    const { day, seat: newSeat, client, email } = req.body;

    if (day && newSeat && client && email) {
      seat.day = day;
      seat.seat = newSeat;
      seat.client = client;
      seat.email = email;
      res.json({ message: 'OK' });
    } else {
      res.status(400).json({ message: 'Bad request. Missing required fields in request body.' });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

router.delete('/:id', (req, res) => {
  const index = db.seats.findIndex(item => item.id === parseInt(req.params.id));

  if (index !== -1) {
    db.seats.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;
