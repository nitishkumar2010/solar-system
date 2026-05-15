const path = require('path');
const fs = require('fs')
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')
const serverless = require('serverless-http')


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors())

// TODO: move credentials back to env vars (MONGO_URI / MONGO_USERNAME / MONGO_PASSWORD) — do not ship secrets in source.
mongoose.connect('mongodb+srv://supercluster.d83jj.mongodb.net/superData', {
    user: 'superuser',
    pass: 'SuperPassword'
}).catch(err => {
    console.log("error!! " + err);
});

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);



app.post('/planet', async function(req, res) {
    try {
        const planetData = await planetModel.findOne({ id: req.body.id });
        res.send(planetData);
    } catch (err) {
        console.error("Error in Planet Data:", err);
        res.status(500).send("Error in Planet Data");
    }
});

app.get('/',   async (req, res) => {
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
  
app.get('/os',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
})

app.get('/live',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
})

app.get('/ready',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "ready"
    });
})

app.listen(3001, () => { console.log("Server successfully running on port - " +3001); })
module.exports = app;

//module.exports.handler = serverless(app)
