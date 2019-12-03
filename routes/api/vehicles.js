const express = require('express');
const router  = express.Router();
const vehicles = require('../../controllers/vehicleController');

router.get('/', vehicles.get_vehicles);

router.get('/:id', vehicles.get_a_vehicle);

router.get('/terminal/day', vehicles.get_vehicles_terminal_count_by_day);

router.get('/terminal/week', vehicles.get_vehicles_terminal_count_by_week);

router.get('/terminal/month', vehicles.get_vehicles_terminal_count_by_month);

module.exports = router;
