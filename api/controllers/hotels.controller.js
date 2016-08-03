var dbConnection = require('../data/dbconnection.js');
var ObjectId = require('mongodb').ObjectId;
var hotelData = require('../data/hotel-data.json');

module.exports.hotelsGetAll = function(req, res) {

	var db = dbConnection.get();
	var collection = db.collection('hotels');

	var offset = (req.query && req.query.offset) ? parseInt(req.query.offset) : 0;
	var count = (req.query && req.query.count) ? parseInt(req.query.count) : docs.length - 1;

	collection.find().skip(offset).limit(count).toArray(function(err, docs) {
		res.status(200).json(docs);
	});
};

module.exports.hotelsGetOne = function(req, res) {

	var db = dbConnection.get();
	var collection = db.collection('hotels');

	var hotelId = ObjectId(req.params.hotelId);

	collection.findOne({
		_id: hotelId
	}, function(err, doc) {
		res.status(200).json(doc);
	});
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
		res.status(400).json({message: "Required data missing from body"});
		console.log(req.body);
	}
};