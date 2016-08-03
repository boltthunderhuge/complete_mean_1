var mongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/meanhotel';

var _connection = null;

var open = function() {
	mongoClient.connect(dburl, function(err, db) {
		if (err) {
			console.log("could not open db : ", dburl);
			return;
		}
		_connection = db;
		console.log("Connection OPEN! ", dburl); 
	});

};

var get = function() {
	return _connection;
};


module.exports = {
	open: open,
	get: get
};

