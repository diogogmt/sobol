var mongoose = require('mongoose')
  , Tag = require('./../models').Tag
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema;


exports.get = function (req, res) {
  console.log("tag get");

	Tag.find({}, function (err, obj) {
		// console.log("obj", obj);
		res.send(obj);
	});
};


exports.create = function (req, res) {
  console.log("tag create");
};


exports.delete = function (req, res) {
  console.log("tag delete");
};

