const express = require('express');
const router  = express.Router();
const Driver = require('../../models/driverModel');
const Journey = require('../../models/journeyModel');
const mongoose     = require('mongoose');

router.get('/', (req, res, next) => {
  Driver.find()
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(400).json(err);
  })
});

router.post('/', (req, res, next) => {
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
});

// /api/drivers/unloaded?status="RETURNING_TO_ORIGIN" ---- VERRRRR!!!! Nao finalizado!!
router.get('/unloaded', (req, res, next) => {
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
})

router.get('/loaded', (req, res, next) => {
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
})

router.put('/:id', (req, res, next) => {
  const { id } = req.params
  const { name, age, gender, hasVehicle, licenseType, loaded, vehicleType } = req.body
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
});

router.get('/:id', (req, res, next) => {
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
})

router.get('/vehicles/owned/count',(req, res, next) => {
  Driver.count({hasVehicle : true })
    .then(count => {
      res.status(200).json({count});
    })
    .catch(err => {
      res.status(400).json(err);
    })
})

router.get('/journeys/driver/:id', (req, res, next) => {
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
      res.status(400).json(err);
    })
})




module.exports = router;
