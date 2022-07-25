const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

let composers = [
  {
    givenname: 'Iannis',
    surname: 'Xenakis'
  },
  {
    givenname: 'John',
    surname: 'Cage'
  },
  {
    givenname: 'Pierre',
    surname: 'Boulez'
  },
  {
    givenname: 'Luigi',
    surname: 'Nono'
  },
  {
    givenname: 'Karlheinz',
    surname: 'Stockhausen'
  },
  {
    givenname: 'Morton',
    surname: 'Feldman'
  },
  {
    givenname: 'Luciano',
    surname: 'Berio'
  },
  {
    givenname: 'György',
    surname: 'Ligeti'
  },
];

// this line creates a write stream (in append mode) and a ‘log.txt’ file in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

// this line sets up the logger that logs requests to log.txt
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.send('Welcome to Greg\'s avant garde music app!');
});

app.get('/composers', (req, res) => {
  res.json(composers);
});

// This implements express.static to serve all static files from the public folder, which is where they should be kept
app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});