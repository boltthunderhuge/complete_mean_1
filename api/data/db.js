var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';

mongoose.connect(dburl);

mongoose.connection.on('connected', function() {
	console.log('mongoose connected to ', dburl);
});

mongoose.connection.on('error', function(err) {
	console.log('mongoose error: ', err);
});

mongoose.connection.on('disconnected', function() {
	console.log('mongoose disconnected');
});

process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('mongoose disconnected on SIGINT');
		process.exit(0);
	});
});

process.on('SIGTERM', function() {
	mongoose.connection.close(function() {
		console.log('mongoose disconnected on SIGTERM');
		process.exit(0);
	});
});

process.once('SIGUSR2', function() {
	mongoose.connection.close(function() {
		console.log('mongoose disconnected on SIGUSR2');
		process.kill(process.pid, 'SIGUSR2');
	});
});

require('./hotels.model.js');  // our schema