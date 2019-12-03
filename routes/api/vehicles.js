const express = require('express');
const router  = express.Router();
const moment     = require('moment');
const Vehicle = require('../../models/vehicleModel');
const Journey = require('../../models/journeyModel');

router.get('/', (req, res, next) => {
  Vehicle.find()
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(400).json(err);
  })
});


router.get('/:id', (req, res, next) => {
  const { id } = req.params
  Vehicle.findById(id)
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(400).json(err);
  })
});

router.get('/terminal/day', (req, res, next) => {
  const { date } = req.query
  Journey.count({ 'status.cod': "ARRIVED_ON_DESTINATION", 'status.date': date})
  .then(response => {
    res.status(200).json({ date, count: response});
  })
  .catch(err => {
    res.status(400).json(err);
  })
});

router.get('/terminal/week', (req, res, next) => {
  const { startDate } = req.query
  Journey.count({ 'status.cod': "ARRIVED_ON_DESTINATION", 'status.date': { $gte: startDate, $lt: moment(startDate).add(7,'days')}})
  .then(response => {
    res.status(200).json({ startDate, count: response});
  })
  .catch(err => {
    res.status(400).json(err);
  })
});

router.get('/terminal/month', (req, res, next) => {
  const { date } = req.query
  Journey.count({ 'status.cod': "ARRIVED_ON_DESTINATION", 'status.date': { $month: moment(date).month }})
  .then(response => {
    res.status(200).json({ startDate, count: response});
  })
  .catch(err => {
    res.status(400).json(err);
  })
});


module.exports = router;
