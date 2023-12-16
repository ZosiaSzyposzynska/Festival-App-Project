const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const getSeatsSummary = (day) => {
  const totalSeats = 50; // liczba wszystkich miejsc
  const takenSeats = db.seats.filter(item => item.day === day && item.client).length; 

  return {
    totalSeats: totalSeats,
    takenSeats: takenSeats,
    freeSeats: totalSeats - takenSeats,
  };
};

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

router.post('/', (req, res, next) => {
  const { day, seat, client, email } = req.body;

  try {
    const isSeatTaken = db.seats.some(item => item.seat === seat && item.day === day);

    if (isSeatTaken) {
      res.status(409).json({ message: 'The slot is already taken...' });
    } else {
      const newSeat = { id: uuidv4(), day, seat, client, email };
      db.seats.push(newSeat);

      req.io.emit('seatsUpdated', db.seats);

      const updatedSummary = getSeatsSummary(day);
      req.io.emit('seatsSummaryUpdated', updatedSummary);

      res.json({ message: 'OK' });
    }
  } catch (error) {
 
    next(error);
  }
});

router.put('/:id', (req, res) => {
  const seat = db.seats.find(item => item.id === parseInt(req.params.id));

  if (seat) {
    const { day, seat: newSeat, client, email } = req.body;

    seat.day = day;
    seat.seat = newSeat;
    seat.client = client;
    seat.email = email;
    req.io.emit('seatsUpdated', db.seats);

    const updatedSummary = getSeatsSummary(day);
    req.io.emit('seatsSummaryUpdated', updatedSummary);

    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

router.delete('/:id', (req, res) => {
  const index = db.seats.findIndex(item => item.id === parseInt(req.params.id));

  if (index !== -1) {
    const deletedSeat = db.seats[index];
    db.seats.splice(index, 1);
    req.io.emit('seatsUpdated', db.seats);

    const updatedSummary = getSeatsSummary(deletedSeat.day);
    req.io.emit('seatsSummaryUpdated', updatedSummary);

    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;
