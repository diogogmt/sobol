var mongoose = require('mongoose')
  , Tag = require('./../models').Tag
  , Media = require('./../models').Media
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , gridfs = require("./../gridfs")
  , im = require('imagemagick')
  , ObjectId = mongoose.Types.ObjectId
  , Schema = mongoose.Schema;

exports.all = function (req, res) {
	console.log("media all");
	var media = new Media();
	Media.find({}, function (err, obj) {
		res.render('media/media', 
	    {
	      layout: "includes/layout",
	      title: 'Media',
	      errors: false,
	      gallery: obj
	    }
	  );
	});
	
};

exports.get = function (req, res) {
	console.log("media get");

	var media = new Media();
	Media.find({}, function (err, obj) {
		// console.log("obj: ", obj);
		res.send(media);
	});

};

exports.one = function (req, res) {
	console.log("media one");
	return gridfs.get(req.params.id, function(err, file) {
    res.header("Content-Type", file.type);
    return file.stream(true).pipe(res);
  });
};

// TODO keep working on searches
exports.search = function (req, res) {
	console.log("media search");
  var filters = req.body.filters ? req.body.filters : new Array
    , i
    , query = {};

  var filters = filters.filter(function (itm, i, a) {
    return i == a.indexOf(itm);
  });
  if (filters.length > 0) {
    query = {
      tags: {$all : filters}
    }
  }
  Media.find(query, function (err, media) {
    res.send(media);
  });

};

exports.create = function (req, res) {
	console.log("media create");
  var media
  , options
  , thumbnail
  , finish = 0
  , file = req.files.file
  , filename = req.body.filename
  , description = req.body.description
  , tags = req.body.tags ? req.body.tags.split(",") : new Array()
  , tag
  , i
  , waitForAsync = 2
  , media = new Media();

  // TODO
  // Init on the media constructor
  media.name = filename;
  media.desc = description;  
  media.tags = tags;

  options = {
    "content_type": file.type,
    metadata: {
      "info": "something ustag 7eful",
    },
  };

  // TODO
  // What if  filename already exists?
  thumbnail = {
    path: "uploads/thumbnail_" + filename,
    filename: "thumbnail_" + filename,
  };

  var done = function () {
    if (++finish === waitForAsync) {
      media.save(function (err) {
        // Do something if error happens
        return res.send(media);
      });
    }
  };

  im.crop({
    srcPath: file.path,
    dstPath: thumbnail.path,
    width: 100,
    height: 100,
    quality: 1
  }, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    console.log(err);
    gridfs.putFile(filename, file.path, options, function(err, result) {
      media.src = result._id;
      done();
    });

    gridfs.putFile(thumbnail.filename, thumbnail.path, options, function(err, result) {
      media.thumbnail = result._id;
      done();
    });
  });
};

exports.edit = function (req, res) {
	console.log("media edit route");
  console.log("req.body", req.body);
  console.log("req.files", req.files);
};

exports.save = function (req, res) {
	console.log("media save");
};

exports.delete = function (req, res) {
	console.log("media delete");
	var mediaID = req.body.mediaID
		,	finish = 0;
	var done = function () {
    if (++finish === 2) {
      Media.remove( { "_id": new ObjectId(mediaID) }, function (err) {
        // Do something if error happens
        return res.redirect("/media");
			});
    }
	};

	Media.findOne( {"_id": new ObjectId(mediaID) }, function (err, media) {
		gridfs.unlink(media.src, function () {
			done();
		});
		gridfs.unlink(media.thumbnail, function () {
			done();
		});
	});

};


exports.tags = function (req, res) {
  console.log("media tags");
  Media.distinct("tags", {}, function (err, media) {
    res.send(media);
  });
};