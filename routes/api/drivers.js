const express = require('express');
const router  = express.Router();
const drivers = require('../../controllers/driverController');

router.get('/', drivers.get_drivers);

router.post('/', drivers.create_driver);
// /api/drivers/unloaded?status=RETURNING_TO_ORIGIN
router.get('/unloaded', drivers.get_unloaded_drivers)

router.get('/loaded', drivers.get_loaded_drivers)

router.get('/:id', drivers.get_a_driver)

router.put('/:id', drivers.update_driver);

router.get('/vehicles/owned/count', drivers.get_drivers_own_vehicle_count)

router.get('/journeys/driver/:id', drivers.get_drivers_journey)

module.exports = router;
