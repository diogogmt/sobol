var mongoose = require('mongoose')
  , Tag = require('./../models').Tag
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema;


exports.all = function (req, res) {
  console.log("tag all");
  var arr = new Array();
	arr[0] = 'haha';
	arr[1] = 'hehe';

	var tag = new Tag();
	tag.name = "first tag";
	tag.save(function (err) {
		console.log("tag.save");
	});

	var tags = new Array();
	Tag.find({}, ['name'], function (err, obj) {
		console.log("obj", obj);
		for (var i = 0; i < obj.length; i++) {
			tags.push(obj[i].name);
		};
		console.log("tags: ", tags);
		res.send(tags);
	});
};


exports.create = function (req, res) {
  console.log("tag create");
};


exports.delete = function (req, res) {
  console.log("tag delete");
};

