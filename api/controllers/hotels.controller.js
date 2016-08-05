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
		res.status(400).json({
			"message": "too many records requested. max is " + maxCount
		});
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

		var response = {
			status: 200,
			json: {}
		};


		if (err) {
			console.log("error");
			response.status = 500;
			response.json = err;
		} else if (!hotel) {
			console.log("no hotel?");
			response.status = 404;
			response.json = {
				"message": "Hotel not found"
			};
		} else {
			response.json = hotel;
			console.log(hotel);
		}
		console.log(response);
		res.status(response.status).json(response.json);
	});
};

var _splitArray = function(input) {
	var output = [];

	if (input && input.length > 0) {
		output = input.split(';');
	}
	return output;
};

module.exports.hotelsAddOne = function(req, res) {
	var newHotelObj = {};
	setHotelObject(newHotelObj, req.body);
	Hotel.create(
		newHotelObj,
		function(err, hotel) {
		console.log('Hotel create callback');
		if (err) {
			console.log('fuckup creating hotel');
			res.status(400).json(err);
		} else {
			console.log('created ' + hotel);
			res.status(201).json(hotel);
		}
	});
};

module.exports.hotelsUpdateOne = function(req, res) {

	var hotelId = req.params.hotelId;

	Hotel.findById(hotelId)
		.select('-reviews -rooms')
		.exec(function(err, hotel) {

			var response = {
				status: 200,
				json: {}
			};


			if (err) {
				console.log("error");
				response.status = 500;
				response.json = err;
			} else if (!hotel) {
				console.log("no hotel?");
				response.status = 404;
				response.json = {
					"message": "Hotel not found"
				};
			}

			// If we get here and the res status has been changed from 200, just return it
			if (response.status !== 200) {
				console.log(response);
				res.status(response.status).json(response.json);
			} else { // we assume that everything is hunky dory
				setHotelObject(hotel, req.body);
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

module.exports.hotelsDeleteOne = function(req, res) {
	var hotelId = req.params.hotelId;

	Hotel.findByIdAndRemove(hotelId).exec(function(err, hotel) {
		if (err) {
			res.status(404).json(err);
		} else {
			res.status(204).json();
		}
	});
};

var runGeoQuery = function(req, res) {

	var lat = parseFloat(req.query.lat);
	var long = parseFloat(req.query.long);

	if (isNaN(lat) || isNaN(long)) {
		res.status(400).json({
			"message": "latitude and/or longitude are bullshit"
		});
		return;
	}

	console.log("lat/long ", lat + "/" + long);

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
			res.status(400).json(err);
			return;
		}
		console.log('Geo results', results);
		console.log('Geo statistics', statistics);

		res.status(200).json(results);
	});
};

var setHotelObject = function(obj, reqBody) {
	obj.name = reqBody.name;
	obj.description = reqBody.description;
	obj.stars = reqBody.stars;
	obj.services = _splitArray(reqBody.services);
	obj.photos = _splitArray(reqBody.photos);
	obj.currency = reqBody.currency;
	obj.location = {
		address: reqBody.address,
		coordinates: [
			parseFloat(reqBody.long),
			parseFloat(reqBody.lat)
		]
	};
};