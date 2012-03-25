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
    width: 150,
    height: 150,
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

  var options
  , thumbnail
  , finish = 0
  , file
  , filename = req.body.filename
  , description = req.body.description
  , tags = req.body.tags ? req.body.tags.split(",") : new Array()
  , mediaID = req.body.mediaID
  , tag
  , i
  , waitForAsync = 2
  , update = {'name' : filename
            , 'desc' : description
            , 'tags' : tags}

  var done = function () {
    console.log("Entering DONE function");
    if (++finish === waitForAsync) {
      console.log("Entering DONE function -- UPDATE TIME");
      var conditions = { _id : new ObjectId(mediaID) }
      Media.update(conditions, update, function (err, numAffected) {
        if(err || numAffected == 0){
          res.send({'success' : false});
        }else{
          res.send({'success' : true});
        }
      });
    }
  };

  if(!req.files){ // There is no new media to upload, so just save the fields
    waitForAsync = 1;
    done();
  }else{
    console.log("There is a new file to upload");
    file = req.files.file;
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
    // Remove the old media files from the db
    deleteMedia(mediaID, function (err){
      if(err){
        // error management
        res.send({'error': true});
      }else{
        // Create and save new media files
        im.crop({
          srcPath: file.path,
          dstPath: thumbnail.path,
          width: 150,
          height: 150,
          quality: 1
        }, function(err, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
          console.log(err);
          gridfs.putFile(filename, file.path, options, function(err, result) {
            update.src = result._id;
            done();
          });

          gridfs.putFile(thumbnail.filename, thumbnail.path, options, function(err, result) {
            update.thumbnail = result._id;
            done();
          });
        });
      }
    });
  }
};

exports.save = function (req, res) {
	console.log("media save");
};

exports.delete = function (req, res) {
  var mediaID = req.body.mediaID;
	deleteMedia(mediaID, function (err){
    if(err){
      // error management
      res.send({'error': true});
    }else{
      Media.remove( { "_id": new ObjectId(mediaID) }, function (err) {
        if(err){
          res.send({'error': true});
        }else{
          res.send();
        }
      });
    }
  });
};


exports.tags = function (req, res) {
  console.log("media tags");
  Media.distinct("tags", {}, function (err, media) {
    res.send(media);
  });
};

function deleteMedia(mediaID, cb){
  console.log("media delete");
  Media.findOne( {"_id": new ObjectId(mediaID) }, function (err, media) {
    gridfs.unlink(media.src, function () {
      gridfs.unlink(media.thumbnail, function () {
        cb();
      });
    });
  });
};