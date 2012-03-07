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
		console.log("obj: ", obj);
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
    console.log("media found");
		// console.log("obj: ", obj);
		res.send(media);
	});

};

exports.one = function (req, res) {
	console.log("media one");
	console.log("id: ", req.params.id);
	return gridfs.get(req.params.id, function(err, file) {
    console.log("getting one media");
		// console.log("file.contentType: ", file.contentType);
    res.header("Content-Type", file.type);
    // res.header("Content-Disposition", "attachment; filename=" + file.filename);
    // console.log("file: ", file);
    return file.stream(true).pipe(res);
  });
};

// TODO keep working on searches
exports.search = function (req, res) {
	console.log("media search");
  var filters = req.body.filters ? req.body.filters : new Array
    , i
    , query = {};

  console.log("filters: ", filters);
  var filters = filters.filter(function (itm, i, a) {
    return i == a.indexOf(itm);
  });
  console.log("unique filters: ", filters);
  if (filters.length > 0) {
    query = {
      tags: {$all : filters}
    }
  }
  console.log("query: ", query)
  Media.find(query, function (err, media) {
    console.log("media find");
    console.log("err: ", err);
    console.log("media: ", media);
    res.send(media);
  });

};

exports.create = function (req, res) {
	console.log("media create");
  console.log("body: ", req.body);
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

  console.log("tags: ", tags);

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
    console.log("done");
    console.log("finish: ", finish);
    console.log("waitForAsync: ", waitForAsync);
    if (++finish === waitForAsync) {
      media.save(function (err) {
        console.log("err: ", err);
        console.log("media: ", media);
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
  	console.log("finish croping");
    gridfs.putFile(filename, file.path, options, function(err, result) {
    	console.log("save source");
      media.src = result._id;
      done();
    });

    gridfs.putFile(thumbnail.filename, thumbnail.path, options, function(err, result) {
    	console.log("save thumbnail");
      media.thumbnail = result._id;
      done();
    });
  });
};

exports.update = function (req, res) {
	console.log("media update");
};

exports.save = function (req, res) {
	console.log("media save");
};

exports.delete = function (req, res) {
	console.log("media delete");
	var mediaID = req.body.mediaID
		,	finish = 0;
	var done = function () {
		console.log("done");

    if (++finish === 2) {
      Media.remove( { "_id": new ObjectId(mediaID) }, function (err) {
				console.log("media removed");
				console.log("err: ", err);
        // Do something if error happens
        return res.redirect("/media");
			});
    }
		
	};
	console.log("mediaID: " + mediaID);
	Media.findOne( {"_id": new ObjectId(mediaID) }, function (err, media) {
		console.log("findOne");
		// console.log("obj: ", obj);
		gridfs.unlink(media.src, function () {
			console.log("src unlink callback");
			done();
		});
		gridfs.unlink(media.thumbnail, function () {
			console.log("thumbnail unlink callback");
			done();
		});
	});
	
};


exports.tags = function (req, res) {
  console.log("media tags route");
  Media.distinct("tags", {}, function (err, media) {
    console.log("media find");
    console.log("err: ", err);
    console.log("media: ", media);
    res.send(media);
  });
};