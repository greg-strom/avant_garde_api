const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

// this line creates a write stream (in append mode) and a ‘log.txt’ file in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

// this line sets up the logger that logs requests to log.txt
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

// This implements express.static to serve all static files from the public folder, which is where they should be kept
app.use(express.static('public'));

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});