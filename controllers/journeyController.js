'use strict';
let Journey = require('../models/journeyModel');

exports.get_journeys = function(req, res) {
  Journey.find()
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(400).json(err);
  })
};

exports.get_journeys_group_by_origin_destination = function(req, res) {
  let aggOrigin = [
    {
      $group: {
      _id: {
        origin: "$origin"
      }
    }},
  ];
  let aggDestination = [
    {
      $group: {
      _id: {
        destination: "$destination"
      }
    }},
  ];
  Journey.aggregate(aggOrigin)
  .then(origins=> {
    Journey.aggregate(aggDestination)
    .then(destinations=> {
      res.status(200).json({origins, destinations})
    })
    .catch(err => res.status(400).json(err))
  })
  .catch(err => res.status(400).json(err))
};
