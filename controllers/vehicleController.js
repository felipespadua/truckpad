'use strict';
let Vehicle = require('../models/vehicleModel');
let Journey = require('../models/journeyModel');
const moment     = require('moment');

exports.get_vehicles = function(req, res) {
  Vehicle.find()
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(400).json(err);
  })
};

exports.get_a_vehicle = function(req, res) {
  const { id } = req.params
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