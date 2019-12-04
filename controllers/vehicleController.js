'use strict';
let Vehicle = require('../models/vehicleModel');
let VehicleType = require('../models/vehicleTypeModel');
let Journey = require('../models/journeyModel');
const moment     = require('moment');
const mongoose = require('mongoose');
const { body, validationResult, query , check} = require('express-validator/check');

exports.get_vehicles = function(req, res) {
  Vehicle.find()
  .then(response => {
    res.status(200).json({vehicles: response});
  })
  .catch(err => {
    res.status(400).json(err);
  })
};

exports.get_vehicles_types = function(req, res) {
  VehicleType.find()
  .then(response => {
    res.status(200).json({vehicleTypes: response});
  })
  .catch(err => {
    res.status(400).json(err);
  })
};

exports.create_vehicle = function(req, res) {
  const { plate, vehicleType } = req.body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(vehicleType)) {
    res.status(400).json({
      message: 'Specified id is not valid'
    });
    return;
  }
  Vehicle.create({
    plate,
    vehicleType
  })
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(400).json(err);
  })
};

exports.get_a_vehicle = function(req, res) {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
        message: 'Specified id is not valid'
    });
    return;
  }
  Vehicle.findById(id)
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(400).json(err);
  })
};

exports.get_vehicles_terminal_count_by_day = function(req, res) {
  const { date } = req.query
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  Journey.count({ 'status.cod': "ARRIVED_ON_DESTINATION", 'status.date': date})
  .then(response => {
    res.status(200).json({ date, count: response});
  })
  .catch(err => {
    res.status(400).json(err);
  })
};

exports.get_vehicles_terminal_count_by_week = function(req, res) {
  const { startDate } = req.query
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  Journey.count({ 'status.cod': "ARRIVED_ON_DESTINATION", 'status.date': { $gte: startDate, $lt: moment(startDate).add(7,'days')}})
  .then(response => {
    res.status(200).json({ startDate, count: response});
  })
  .catch(err => {
    res.status(400).json(err);
  })
};

exports.get_vehicles_terminal_count_by_month = function(req, res) {
  const { date } = req.query
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  //index do moment comeca com 0, por isso o + 1
  let month = moment(date).month() + 1
  Journey.find()
  .then(journeys => {
    let filteredJourneys = journeys.filter(journey => {
      let found =  journey.status.find(el => {
        let statusMonth =  moment(el.date).month() + 1
        return el.cod === "ARRIVED_ON_DESTINATION" && statusMonth == month
      })
      return found === undefined ? false : true
    })
    res.status(200).json({ month, count: filteredJourneys.length});
  })
  .catch(err => {
    res.status(400).json(err);
  })
};

exports.validate = (method) => {
  switch (method) {
    case 'create_vehicle': {
      return [ 
          body('plate', 'plate must exist').exists(),
          body('plate').isString(),
          body('vehicleType').exists(),
        ]   
      }
    case 'get_vehicles_terminal_count_by_day': {
      return [ 
          query('date', 'date must exist').exists(),
          check('date').custom(isValidDate).withMessage('the date must be valid on format yyyy-mm-dd')
        ]   
      }
    case 'get_vehicles_terminal_count_by_week': {
      return [ 
          query('startDate', 'startDate must exist').exists(),
          check('startDate').custom(isValidDate).withMessage('the startDate must be valid on format yyyy-mm-dd')
        ]   
    }
    case 'get_vehicles_terminal_count_by_month': {
      return [ 
          query('date', 'date must exist').exists(),
          check('date').custom(isValidDate).withMessage('the date must be valid on format yyyy-mm-dd')
        ]   
    }
  }
}

function isValidDate(value) {
  if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

  const date = new Date(value);
  if (!date.getTime()) return false;
  return date.toISOString().slice(0, 10) === value;
}