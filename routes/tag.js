var mongoose = require('mongoose')
  , Tag = require('./../models').Tag
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema;


exports.get = function (req, res) {
  console.log("tag get");

	var tags = new Array();
	Tag.find({}, ['name'], function (err, obj) {
		// console.log("obj", obj);
		for (var i = 0; i < obj.length; i++) {
			tags.push(obj[i].name);
		};
		// console.log("tags: ", tags);
		res.send(tags);
	});
};


exports.create = function (req, res) {
  console.log("tag create");
};


exports.delete = function (req, res) {
  console.log("tag delete");
};

