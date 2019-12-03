'use strict';
let Driver = require('../models/driverModel');
let Journey = require('../models/journeyModel');

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
    const { name, age, gender, hasVehicle, licenseType, loaded, vehicleType } = req.body
    Driver.create({
      name,
      age,
      gender,
      hasVehicle,
      licenseType,
      loaded,
      vehicleType
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
    const { name, age, gender, hasVehicle, licenseType, loaded, vehicleType } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
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
        loaded: loaded != null ? loaded : driver.loaded,
        vehicleType: vehicleType != null ? vehicleType : driver.vehicleType,
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
    Driver.find({status})
    .populate('vehicle')
    .then(driversFromDb => {
      let unloadedDrivers = driversFromDb.filter(driver => driver.loaded() === false)
      res.status(200).json({drivers: unloadedDrivers})
    })
    .catch(err => {
      res.status(400).json(err);
    })
};

exports.get_loaded_drivers = function(req, res) {
    const { status } = req.query
    Driver.find({status})
    .populate('vehicle')
    .then(driversFromDb => {
      let unloadedDrivers = driversFromDb.filter(driver => driver.loaded() === true)
      res.status(200).json({drivers: unloadedDrivers})
    })
    .catch(err => {
      res.status(400).json(err);
    })
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
