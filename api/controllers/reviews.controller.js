var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res) {

	var offset = (req.query && req.query.offset) ? parseInt(req.query.offset) : 0;
	var count = (req.query && req.query.count) ? parseInt(req.query.count) : 1;

	var hotelId = req.params.hotelId;


	Hotel.findById(hotelId).select('reviews').exec(function(err, hotel) {
		console.log('found ', hotel);

		res.json(hotel.reviews);
	});
};

module.exports.reviewsGetOne = function(req, res) {
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;

	Hotel.findById(hotelId).select('reviews').exec(function(err, hotel) {
		if (err) {
			res.status(404).json(err);
			return;
		}
		console.log(hotel);
		var review = hotel.reviews.id(reviewId);
		res.json(review);
	});
};

module.exports.reviewsAddOne = function(req, res) {

	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;

	Hotel.findById(hotelId)
	.select('reviews')
	.exec(function(err, hotel) {
		var response = {status: 200, message: {}};

		if (err) {
			response.status = 400;
			response.message = err;
		} else if (!hotel) {
			response.status = 404;
			response.message = {"message": "Hotel not found in database"};
		} else {
			_addReview(req, res, hotel);
		}
	});
};

module.exports.reviewsUpdateOne = function(req, res) {

	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;

	Hotel.findById(hotelId).select('reviews').exec(function(err, hotel) {
		if (err) {
			res.status(404).json(err);
		} else {
			var review = hotel.reviews.id(reviewId);
			review.name = req.body.name;
			review.rating = parseInt(req.body.rating, 10);
			review.review = req.body.review;

			hotel.save(function(err, updatedHotel) {
				if (err) {
					res.status(500).json(err);
				} else {
					res.status(204).json();
				}
			});
		}
	});
};

module.exports.reviewsDeleteOne = function(req, res) {
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;

	Hotel.findById(hotelId).select('reviews').exec(function(err, hotel) {
		if (err) {
			res.status.json(err);
		} else {
			hotel.reviews.id(reviewId).remove();
			hotel.save(function(err, review) {
				if (err) {
					res.status(404).json(err);
				} else {
					res.status(204).json();
				}
			});
		}
	});
};

var _addReview = function(req, res, hotel) {
	hotel.reviews.push({
		name: req.body.name,
		rating: parseInt(req.body.rating, 10),
		review: req.body.review
	});

	console.log(hotel);
	hotel.save(function(err, updatedHotel, numAffected) {
		if (err) {
			res.status(400).send(err);
		} else if (updatedHotel) {
			res.status(201).json(updatedHotel.reviews[updatedHotel.reviews.length-1]);
		} else {
			console.log("Ummm....");
		}
	});
};
