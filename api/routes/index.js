var express = require('express');
var router = express.Router();
var controllerHotels = require('../controllers/hotels.controller.js');

router.route('/hotels').get(controllerHotels.hotelsGetAll);
router.route('/hotels/:hotelId').get(controllerHotels.hotelsGetOne);
router.route('/hotels/new').post(controllerHotels.hotelsAddOne);

module.exports = router;

