var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res) {

	if (req.query && req.query.lat && req.query.long) {
		renGeoQuery(req, res);
		return;
	}

	var offset = (req.query && req.query.offset) ? parseInt(req.query.offset) : 0;
	var count = (req.query && req.query.count) ? parseInt(req.query.count) : 1;

	var hotelId = req.params.hotelId;


	Hotel.findById(hotelId).select('reviews').exec(function(err, hotel) {
		console.log('found ', hotel);
		/*hotel.find().skip(offset).limit(count).exec(function(err, reviews))*/
		res.json(hotel.reviews);
	});
};

module.exports.reviewsGetOne = function(req, res) {
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;

	Hotel.findById(hotelId).select('reviews').exec(function(err, hotel) {
		console.log('found ', hotel);
		var review = hotel.reviews.id(reviewId);
		/*hotel.find().skip(offset).limit(count).exec(function(err, reviews))*/
		res.json(review);
	});
};

var runGeoQuery = function(req, res) {

	var lat = parseFloat(req.query.lat);
	var long = parseFloat(req.query.long);

	// a geoJSON point
	var point = {
		type: "Point",
		coordinates: [long, lat]
	};

	var geoOptions = {
		spherical: true,
		maxDistnace: 2000,
		num: 5
	};

	Hotel.geoNear(point, geoOptions, function(err, results, statistics) {
		console.log('Geo results', results);
		console.log('Geo statistics', statistics);

		res.status(200).json(results);
	});
};