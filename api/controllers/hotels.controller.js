var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');


module.exports.hotelsGetAll = function(req, res) {

	if (req.query && req.query.lat && req.query.long) {
		runGeoQuery(req, res);
		return;
	}

	var maxCount = 5;

	var offset = (req.query && req.query.offset) ? parseInt(req.query.offset) : 0;
	var count = (req.query && req.query.count) ? parseInt(req.query.count) : 1;

	if (isNaN(offset) || isNaN(count)) {
		res.status(400).send("Nope!");
		return;
	}

	if (count > maxCount) {
		res.status(400).json({"message": "too many records requested. max is " + maxCount});
		return;
	}

	Hotel.find().skip(offset).limit(count).exec(function(err, hotels) {
		if (err) {
			console.log("Error finding hotels");
			res.status(500).json(err);
		} else {
			console.log('found ', hotels.length);
			res.json(hotels);
		}
	});
	/*collection.find().skip(offset).limit(count).toArray(function(err, docs) {
		res.status(200).json(docs);
	});*/
};

module.exports.hotelsGetOne = function(req, res) {
	var hotelId = req.params.hotelId;

	Hotel.findById(hotelId).exec(function(err, hotel) {
		console.log('found hotel');
		res.json(hotel);
	});

	/*collection.findOne({
		_id: hotelId
	}, function(err, doc) {
		res.status(200).json(doc);
	});*/
};


module.exports.hotelsAddOne = function(req, res) {

	var db = dbConnection.get();
	var collection = db.collection('hotels');

	var newHotel;
	if (req.body && req.body.name && req.body.stars) {
		newHotel = req.body;
		newHotel.stars = parseInt(req.body.stars);

		console.log(collection);
		collection.insertOne(newHotel, function(err, result) {
			res.status(201).json(result.ops);
		});
	} else {
		res.status(400).json({
			message: "Required data missing from body"
		});
		console.log(req.body);
	}
};

var runGeoQuery = function(req, res) {

	var lat = parseFloat(req.query.lat);
	var long = parseFloat(req.query.long);

	// a GeoJSON point
	var point = {
		type: "Point",
		coordinates: [long, lat]
	};

	var geoOptions = {
		spherical: true,
		maxDistance: 2000,
		num: 5
	};


	Hotel.geoNear(point, geoOptions, function(err, results, statistics) {

		if (err) {
			console.log(err);
			return;
		}
		console.log('Geo results', results);
		console.log('Geo statistics', statistics);

		res.status(200).json(results);
	});
};