const express = require('express'),
  morgan = require('morgan');
const app = express();

app.use(morgan('common'));