const express = require('express');
const router  = express.Router();
const journeyController = require('../../controllers/journeyController');

router.get('/', journeyController.get_journeys);

router.get('/origin-destination', journeyController.get_journeys_group_by_origin_destination)


module.exports = router;