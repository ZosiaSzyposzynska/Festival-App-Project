const express = require('express');
const app = express();
const cors = require('cors');
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');
const db = require('./db');
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');
app.use(cors());

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);
io.on('connection', (socket) => {
  console.log('New Socket!');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
  req.io = io;
  next();
})

app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/concerts', concertsRoutes);
app.use('/api/seats', seatsRoutes);

mongoose.connect(`mongodb+srv://zosiaszyp:${process.env.DB_PASS}@cluster0.yqk7btz.mongodb.net/NewWaveDB?retryWrites=true&w=majority`);

const newwave = mongoose.connection;

newwave.once('open', () => {
  console.log('Connected to the database');
});
newwave.on('error', err => console.log('Error ' + err));



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.get('/', (req, res) => {
  res.json(db);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});


