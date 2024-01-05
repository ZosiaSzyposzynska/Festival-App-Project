
const express = require('express');
const router = express.Router();
const concertsController = require('../controllers/concerts.controller');

router.get('/', concertsController.getAllConcerts);
router.get('/:id', concertsController.getConcertById);
router.post('/', concertsController.addConcert);
router.put('/:id', concertsController.updateConcert);
router.delete('/:id', concertsController.deleteConcert);


router.get('/performer/:performer', concertsController.getConcertsbyPerformer);
router.get('/genre/:genre', concertsController.getConcertsbyGenre);
router.get('/price/:price_min/:price_max', concertsController.getConcertsbyPriceRange);
router.get('/day/:day', concertsController.getConcertsByDay);

module.exports = router;
