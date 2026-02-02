const path = require('path');
const fs = require('fs');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
// const serverless = require('serverless-http');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// ✅ MongoDB connection (practice version with hardcoded creds)
mongoose.connect(
  'mongodb+srv://superuser:SuperPassword@supercluster.d83jj.mongodb.net/superData',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Schema & Model
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

// Routes
app.post('/planet', function (req, res) {
  planetModel.findOne({ id: req.body.id }, function (err, planetData) {
    if (err) {
      res.status(500).send('Error in Planet Data');
    } else {
      res.send(planetData);
    }
  });
});

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/api-docs', (req, res) => {
  fs.readFile('oas.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error reading file');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.get('/os', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    os: OS.hostname(),
    env: process.env.NODE_ENV
  });
});

app.get('/live', function (req, res) {
  res.json({ status: 'live' });
});

app.get('/ready', function (req, res) {
  res.json({ status: 'ready' });
});

// Start server
app.listen(3000, () => {
  console.log('Server successfully running on port - 3000');
});

module.exports = app;
// module.exports.handler = serverless(app);
