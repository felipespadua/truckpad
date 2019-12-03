'use strict';
let Driver = require('../models/driverModel');
let Journey = require('../models/journeyModel');
const { body, validationResult, query } = require('express-validator/check');

exports.get_drivers = function(req, res) {
    Driver.find()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(400).json(err);
    })
};

exports.get_a_driver = function(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({
          message: 'Specified id is not valid'
      });
      return;
    }
    Driver.findById(req.params.id).populate('vehicleType')
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(400).json(err);
    })
};

exports.create_driver = function(req, res) {
    const { name, age, gender, hasVehicle, licenseType, vehicle } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    if (vehicle != null && !mongoose.Types.ObjectId.isValid(vehicle)) {
      res.status(400).json({
        message: 'Specified id is not valid'
      });
      return;
    }
    Driver.create({
      name,
      age,
      gender,
      hasVehicle,
      licenseType,
      vehicle
    })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(400).json(err);
    })
};

exports.update_driver = function(req, res) {
    const { id } = req.params
    const { name, age, gender, hasVehicle, licenseType, vehicle } = req.body
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          message: 'Specified id is not valid'
        });
        return;
      }
    if (vehicle != null && !mongoose.Types.ObjectId.isValid(vehicle)) {
        res.status(400).json({
          message: 'Specified id is not valid'
        });
        return;
      }
    Driver.findById(id)
    .then(driver => {
      let updatedDriver = new Driver({
        name: name != null ? name : driver.name,
        age: age != null ? age : driver.age,
        gender: gender != null ? gender : driver.gender,
        hasVehicle: hasVehicle != null ? hasVehicle : driver.hasVehicle,
        licenseType: licenseType != null ? licenseType : driver.licenseType,
        vehicle
      })
      updatedDriver.save()
        .then(response => {
          res.status(200).json(response)
        })
        .catch(err => {
          res.status(400).json(err);
        })
    })
    .catch(err => {
      res.status(400).json(err);
    })
};

exports.get_unloaded_drivers = function(req, res) {
  const { status } = req.query
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  } 
  Journey.find({'status.cod': status})
  .populate({
    path: 'driver',
    populate: { path: 'vehicle' },
  })
  .then(journeyFromDb => {
    let filteredJourneys = journeyFromDb.map(journey => {
      return journey.driver
    }).filter(driver => driver.vehicle.loaded === false)
    res.status(200).json(filteredJourneys)
  })
  .catch(err => console.log("Error finding journey",err))
};

exports.get_loaded_drivers = function(req, res) {
  const { status } = req.query
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  Journey.find({'status.cod': status})
  .populate({
    path: 'driver',
    populate: { path: 'vehicle' },
  })
  .then(journeyFromDb => {
    let filteredJourneys = journeyFromDb.map(journey => {
      return journey.driver
    }).filter(driver => driver.vehicle.loaded === true)
    res.status(200).json(filteredJourneys)
  })
  .catch(err => console.log("Error finding journey",err))
};

exports.get_drivers_own_vehicle_count = function(req, res) {
    Driver.count({hasVehicle : true })
    .then(count => {
      res.status(200).json({count});
    })
    .catch(err => {
      res.status(400).json(err);
    })
};

exports.get_drivers_journey = function(req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Specified id is not valid'
      });
      return;
    }
    Journey.findOne({ driver: id, status: { $ne: "JOURNEY_CONCLUDED"}})
    .populate('driver')
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {
        es.status(400).json(err);
    })
};

exports.validate = (method) => {
  switch (method) {
    case 'create_driver': {
     return [ 
        body('name', 'name doesnt exists').exists(),
        body('name', 'name must be string').isString(),
        body('age', 'age doesnt exists').exists(),
        body('age', 'age must be number').isNumeric(),
        body('gender', 'gender doesnt exists').exists(),
        body('gender', 'gender must be string').isString(),
        body('hasVehicle', 'hasVehicle doesnt exists').exists(),
        body('hasVehicle', 'hasVehicle must be boolean').isBoolean(),
        body('licenseType', 'licenseType doesnt exists').exists(),
        body('licenseType', 'licenseType must be string').isString()
       ]   
    }
  case 'update_driver': {
    return [ 
       body('name', 'name doesnt exists').exists(),
       body('name', 'name must be string').isString(),
       body('age', 'age doesnt exists').exists(),
       body('age', 'age must be number').isNumeric(),
       body('gender', 'gender doesnt exists').exists(),
       body('gender', 'gender must be string').isString(),
       body('hasVehicle', 'hasVehicle doesnt exists').exists(),
       body('hasVehicle', 'hasVehicle must be boolean').isBoolean(),
       body('licenseType', 'licenseType doesnt exists').exists(),
       body('licenseType', 'licenseType must be string').isString()
      ]   
    }
  case 'get_unloaded_drivers': {
    return [ 
        query('status', 'status must exist').exists(),
        query('status', 'status value must be in ["GOING_TO_DESTINATION","RETURNING_TO_ORIGIN", "ARRIVED_ON_DESTINATION","JOURNEY_CONCLUDED"]').isIn(["GOING_TO_DESTINATION","RETURNING_TO_ORIGIN", "ARRIVED_ON_DESTINATION","JOURNEY_CONCLUDED"])
      ]   
    }
  case 'get_loaded_drivers': {
    return [ 
        query('status', 'status must exist').exists(),
        query('status', 'status value must be in ["GOING_TO_DESTINATION","RETURNING_TO_ORIGIN", "ARRIVED_ON_DESTINATION","JOURNEY_CONCLUDED"]').isIn(["GOING_TO_DESTINATION","RETURNING_TO_ORIGIN", "ARRIVED_ON_DESTINATION","JOURNEY_CONCLUDED"])
      ]   
    }
  }
}
