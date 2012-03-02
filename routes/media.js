var mongoose = require('mongoose')
  , Tag = require('./../models').Tag
  , Media = require('./../models').Media
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema;


exports.all = function (req, res) {
	console.log("media all");
	res.render('media/media', 
    {
      layout: "includes/layout",
      title: 'Media',
      errors: false,
      tags: tags	
    }
  );
};

exports.get = function (req, res) {
	console.log("media get");


	var tags = new Array();
	Tag.find({}, ['name'], function (err, obj) {
	console.log("obj: ". obj);
	});
	
};

exports.one = function (req, res) {
	console.log("media one");
};

exports.search = function (req, res) {
	console.log("media search");
};

exports.create = function (req, res) {
	console.log("media create");
};

exports.update = function (req, res) {
	console.log("media update");
};

exports.save = function (req, res) {
	console.log("media save");
};

exports.delete = function (req, res) {
	console.log("media delete");
};

