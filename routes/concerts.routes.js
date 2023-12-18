
const express = require('express');
const router = express.Router();
const concertsController = require('../controllers/concerts.controller');

router.get('/', concertsController.getAllConcerts);
router.get('/:id', concertsController.getConcertById);
router.post('/', concertsController.addConcert);
router.put('/:id', concertsController.updateConcert);
router.delete('/:id', concertsController.deleteConcert);

module.exports = router;
