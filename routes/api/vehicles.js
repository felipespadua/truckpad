const express = require('express');
const router  = express.Router();
const mongoose     = require('mongoose');
const Vehicle = require('../../models/vehicleModel');

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



module.exports = router;
