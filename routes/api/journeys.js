const express = require('express');
const router  = express.Router();
const Driver = require('../../models/driverModel');
const Journey = require('../../models/journeyModel');
const mongoose     = require('mongoose');

router.get('/', (req, res, next) => {
  Journey.find()
  .then(response => {
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(400).json(err);
  })
});

router.get('/drivers', (req, res, next) => {
  const { driverId, status } = req.query
  if (!mongoose.Types.ObjectId.isValid(driverId)) {
    res.status(400).json({
      message: 'Specified driverId is not valid'
    });
    return;
  }
  Journey.find({driver: driverId, status: status})
    .then(journayData => {
      res.status(200).json(journayData);
    })
    .catch(err => {
      res.status(400).json(err);
    })
})

////ver!!!!!!!!
router.get('/drivers', (req, res, next) => {
  const { driverId, status } = req.query
  if (!mongoose.Types.ObjectId.isValid(driverId)) {
    res.status(400).json({
      message: 'Specified driverId is not valid'
    });
    return;
  }
  Journey.find({driver: driverId, status: status})
    .then(journayData => {
      res.status(200).json(journayData);
    })
    .catch(err => {
      res.status(400).json(err);
    })
})

module.exports = router;