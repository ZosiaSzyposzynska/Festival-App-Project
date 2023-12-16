const express = require('express');
const app = express();
const cors = require('cors');
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');
const db = require('./db');
const path = require('path');


app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/client/build')));

app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/concerts', concertsRoutes);
app.use('/api/seats', seatsRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.get('/', (req, res) => {
  res.json(db);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});