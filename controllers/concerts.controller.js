

const Concert = require('../models/concerts.model');

const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.json(concerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getConcertById = async (req, res) => {
  const { id } = req.params;

  try {
    const concert = await Concert.findById(id);

    if (concert) {
      res.json(concert);
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addConcert = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;

  try {
    const newConcert = new Concert({ performer, genre, price, day, image });
    await newConcert.save();
    res.json({ message: 'OK' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateConcert = async (req, res) => {
  const { id } = req.params;
  const { performer, genre, price, day, image } = req.body;

  try {
    const concert = await Concert.findById(id);

    if (concert) {
      concert.performer = performer;
      concert.genre = genre;
      concert.price = price;
      concert.day = day;
      concert.image = image;

      await concert.save();
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteConcert = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Concert.findByIdAndDelete(id);

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


const getConcertsbyPerformer = async (req, res) => {

  const { performer } = req.params;

   try {
    const concerts = await Concert.find({ performer });
    res.json(concerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

};

const getConcertsbyGenre = async (req, res) => {

  const { genre } = req.params;

  try {
    const concerts = await Concert.find({ genre });
    res.json(concerts);

  } catch(error){
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

};

const getConcertsbyPriceRange = async (req, res) => {

  const { price_min, price_max } = req.params;

  try {

    const concerts = await Concert.find({ price: { $gte: price_min, $lte: price_max } });
    res.json(concerts);
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getConcertsByDay = async (req, res) => {
  const { day } = req.params;

  try {
    const concerts = await Concert.find({ day });
    res.json(concerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  getAllConcerts,
  getConcertById,
  addConcert,
  updateConcert,
  deleteConcert,
  getConcertsbyPerformer,
  getConcertsbyGenre,
  getConcertsbyPriceRange,
  getConcertsByDay
};
