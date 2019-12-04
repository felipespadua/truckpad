const express = require('express');
const router  = express.Router();
const vehicleController = require('../../controllers/vehicleController');

router.get('/', vehicleController.get_vehicles);

router.get('/types', vehicleController.get_vehicles_types);

router.post('/', vehicleController.validate("create_vehicle"), vehicleController.create_vehicle);

router.get('/:id', vehicleController.get_a_vehicle);

router.get('/terminal/day', vehicleController.validate("get_vehicles_terminal_count_by_day"), vehicleController.get_vehicles_terminal_count_by_day);

router.get('/terminal/week', vehicleController.validate("get_vehicles_terminal_count_by_week"), vehicleController.get_vehicles_terminal_count_by_week);

router.get('/terminal/month', vehicleController.validate("get_vehicles_terminal_count_by_month"), vehicleController.get_vehicles_terminal_count_by_month);

module.exports = router;
