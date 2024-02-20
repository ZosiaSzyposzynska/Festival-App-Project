

const Seat = require('../models/seats.model');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const sanitize = require('mongo-sanitize');

const getSeatsSummary = (day) => {
  const totalSeats = 50; // liczba wszystkich miejsc
  const takenSeats = db.seats.filter(item => item.day === day && item.client).length; 

  return {
    totalSeats: totalSeats,
    takenSeats: takenSeats,
    freeSeats: totalSeats - takenSeats,
  };
};


const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (seat) {
      res.json(seat);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const addSeat = async (req, res, next) => {
  const { day, seat, client, email } = req.body;
  const cleanDay = sanitize(day);
  const cleanSeat = sanitize(seat);
  const cleanClient = sanitize(client);
  const cleanEmail = sanitize(email);

  try {
    const isSeatTaken = await Seat.exists({ seat: seat, day: day });

    if (isSeatTaken) {
      res.status(409).json({ message: 'The slot is already taken...' });
    } else {
      const newSeat = new Seat({ id: uuidv4(), cleanDay, cleanSeat, cleanClient, cleanEmail});
      const savedSeat = await newSeat.save();

      req.io.emit('seatsUpdated', savedSeat);

      const updatedSummary = getSeatsSummary(day);
      req.io.emit('seatsSummaryUpdated', updatedSummary);

      res.json({ message: 'OK' });
    }
  } catch (error) {
    next(error);
  }
};

const updateSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);

    if (seat) {
      const { day, seat: newSeat, client, email } = req.body;

      seat.day = day;
      seat.seat = newSeat;
      seat.client = client;
      seat.email = email;
      await seat.save();

      req.io.emit('seatsUpdated', seat);

      const updatedSummary = getSeatsSummary(day);
      req.io.emit('seatsSummaryUpdated', updatedSummary);

      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);

    if (seat) {
      const deletedSeat = seat;
      await seat.remove();

      req.io.emit('seatsUpdated', deletedSeat);

      const updatedSummary = getSeatsSummary(deletedSeat.day);
      req.io.emit('seatsSummaryUpdated', updatedSummary);

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
  getAllSeats,
  getSeatById,
  addSeat,
  updateSeat,
  deleteSeat
};
