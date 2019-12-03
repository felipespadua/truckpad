const express = require('express');
const router  = express.Router();
const driverController = require('../../controllers/driverController');

router.get('/',  driverController.get_drivers);

router.post('/', driverController.validate('create_driver'), driverController.create_driver);
// /api/drivers/unloaded?status=RETURNING_TO_ORIGIN
router.get('/unloaded',driverController.validate('get_unloaded_drivers'), driverController.get_unloaded_drivers)

router.get('/loaded', driverController.validate('get_loaded_drivers'), driverController.get_loaded_drivers)

router.get('/:id', driverController.get_a_driver)

router.put('/:id', driverController.validate('update_driver'), driverController.update_driver);

router.get('/vehicles/owned/count', driverController.get_drivers_own_vehicle_count)

router.get('/journeys/driver/:id', driverController.get_drivers_journey)

module.exports = router;
