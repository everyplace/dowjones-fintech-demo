/*
* Stub model for outputting feeds
*/

var mongodb = require('./mongodb');


exports.get = function(callback) {
	mongodb.find({}, {collectionName:'feeds'}, callback);
};

exports.getInfo = function(id, callback) {
	mongodb.findOne({'id':id}, {collectionName:'feeds'}, callback);
};