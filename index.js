const mongoose = require('mongoose');
const Models = require('./models.js');

const Composers = Models.Composer;
const Pieces = Models.Piece;
const Recordings = Models.Recording;
const Discs = Models.Disc;

// mongoose.connect('mongodb://localhost:27017/agdb', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

const cors = require('cors');
app.use(cors());

// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:3000/'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true);
//   }
// }));

// this line creates a write stream (in append mode) and a ‘log.txt’ file in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

// this line sets up the logger that logs requests to log.txt
app.use(morgan('combined', { stream: accessLogStream }));

// This implements express.static to serve all static files from the public folder, which is where they should be kept
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to Greg\'s avant garde music app!');
});

// Get all composers
app.get('/composers', (req, res) => {
  Composers.find()
    .then((composers) => {
      res.status(201).json(composers);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all pieces
app.get('/pieces', (req, res) => {
  Pieces.find().populate('composer')
    .then((pieces) => {
      res.status(201).json(pieces);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all recordings
app.get('/recordings', (req, res) => {
  Recordings.find().populate('piece composer')
    .then((recordings) => {
      res.status(201).json(recordings);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all recordings of a given piece
app.get('/pieces/:pieceID/recordings', (req, res) => {
  Recordings.find({ piece: req.params.pieceID })
    .then((recordings) => {
      res.status(201).json(recordings);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get all discs that have any recording of a given piece
app.get('/pieces/:pieceID/discs', (req, res) => {
  Discs.find({ pieces: req.params.pieceID }).populate('recordings')
    .then((Discs) => {
      const desiredDiscs = Discs.filter(Disc => Disc.recordings.findIndex(el => el.piece == req.params.pieceID) > -1)
      res.status(201).json(desiredDiscs);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Get all CDs
app.get('/discs', (req, res) => {
  Discs.find().populate({ path: 'recordings', populate: { path: 'composer piece' } })
    .then((Discs) => {
      res.status(201).json(Discs);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a composer by surname
app.get('/composers/:surname', (req, res) => {
  Composers.findOne({ surname: req.params.surname })
    .then((composer) => {
      res.json(composer);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a piece by ID
app.get('/pieces/:pieceID', (req, res) => {
  Pieces.findOne({ _id: req.params.pieceID })
    .then((piece) => {
      res.json(piece);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a recording by ID
app.get('/recordings/:recordingID', (req, res) => {
  Recordings.findOne({ _id: req.params.recordingID })
    .then((recording) => {
      res.json(recording);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a CD by ID
app.get('/discs/:DiscID', (req, res) => {
  Discs.findOne({ _id: req.params.DiscID }).populate({ path: 'recordings', populate: { path: 'composer piece' } })
    .then((Disc) => {
      res.json(Disc);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get all discs that have a given recording of a given piece....
app.get('/recordings/:recordingID/discs', (req, res) => {
  Discs.find({ recordings: req.params.recordingID })
    .then((Disc) => {
      res.json(Disc);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});