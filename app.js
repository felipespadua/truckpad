require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const expressValidator = require('express-validator')

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator({
  customValidators: {
    isValidDate: isValidDate
  }
}));

function isValidDate(value) {
  if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

  const date = new Date(value);
  if (!date.getTime()) return false;
  return date.toISOString().slice(0, 10) === value;
}

app.use('/api', require('./routes/api/index'));
app.use('/api/drivers', require('./routes/api/drivers'));
app.use('/api/vehicles', require('./routes/api/vehicles'));
app.use('/api/journeys', require('./routes/api/journeys'));

module.exports = app;
