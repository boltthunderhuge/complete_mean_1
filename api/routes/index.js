var express = require('express');
var router = express.Router();
var controllerHotels = require('../controllers/hotels.controller.js');
var controllerReviews = require('../controllers/reviews.controller.js');

router.route('/hotels').get(controllerHotels.hotelsGetAll);
router.route('/hotels/:hotelId').get(controllerHotels.hotelsGetOne);
router.route('/hotels/new').post(controllerHotels.hotelsAddOne);

router.route('/hotels/:hotelId/reviews').get(controllerReviews.reviewsGetAll);
router.route('/hotels/:hotelId/reviews/:reviewId').get(controllerReviews.reviewsGetOne);
//router.route('/hotels/:hotelId/reviews/new').post(controllerReviews.reviewsAddOne);

module.exports = router;

