const express = require('express');
const router  = express.Router();
const Driver = require('../models/driverModel');

router.post('/driver', (req, res, next) => {
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

router.get('/driver/:id', (req, res, next) => {

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

module.exports = router;
