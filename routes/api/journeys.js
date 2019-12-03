const express = require('express');
const router  = express.Router();
const journeys = require('../../controllers/journeyController');

router.get('/', journeys.get_journeys);

// router.get('/driver', (req, res, next) => {
//   const { driverId } = req.query
//   if (!mongoose.Types.ObjectId.isValid(driverId)) {
//     res.status(400).json({
//       message: 'Specified driverId is not valid'
//     });
//     return;
//   }
//   Journey.find({driver: driverId})
//     .then(journayData => {
//       res.status(200).json(journayData);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     })
// })

router.get('/origin-destination', journeys.get_journeys_group_by_origin_destination)

// ////ver!!!!!!!!
// router.get('/drivers', (req, res, next) => {
//   const { driverId, status } = req.query
//   if (!mongoose.Types.ObjectId.isValid(driverId)) {
//     res.status(400).json({
//       message: 'Specified driverId is not valid'
//     });
//     return;
//   }
//   Journey.find({driver: driverId, status: status})
//     .then(journayData => {
//       res.status(200).json(journayData);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     })
// })

module.exports = router;