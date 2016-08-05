var express = require('express');
var router = express.Router();
var controllerHotels = require('../controllers/hotels.controller.js');
var controllerReviews = require('../controllers/reviews.controller.js');

router.route('/hotels')
	.get(controllerHotels.hotelsGetAll)
	.post(controllerHotels.hotelsAddOne);

router.route('/hotels/:hotelId')
	.get(controllerHotels.hotelsGetOne)
	.put(controllerHotels.hotelsUpdateOne)
	.delete(controllerHotels.hotelsDeleteOne);

router.route('/hotels').post(controllerHotels.hotelsAddOne);

router.route('/hotels/:hotelId/reviews')
	.get(controllerReviews.reviewsGetAll)
	.post(controllerReviews.reviewsAddOne);

router.route('/hotels/:hotelId/reviews/:reviewId')
	.get(controllerReviews.reviewsGetOne)
	.put(controllerReviews.reviewsUpdateOne)
	.delete(controllerReviews.reviewsDeleteOne);

//router.route('/hotels/:hotelId/reviews/new').post(controllerReviews.reviewsAddOne);

module.exports = router;


