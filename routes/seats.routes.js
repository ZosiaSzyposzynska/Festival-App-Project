
const express = require('express');
const router = express.Router();
const seatsController = require('../controllers/seats.controller');

router.get('/', seatsController.getAllSeats);
router.get('/:id', seatsController.getSeatById);
router.post('/', seatsController.addSeat);
router.put('/:id', seatsController.updateSeat);
router.delete('/:id', seatsController.deleteSeat);

module.exports = router;
