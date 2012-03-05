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
  var filters = req.body.filters.split(",");
  console.log("filters: ", filters);

  filters.shift();
  console.log("filters: ", filters);

  Media.find({}, function (err, obj) {
    console.log("obj: ", obj);
    res.send(obj);
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
  , newTags = req.body.newTags.split(",")
  , existingTags = req.body.existingTags.split(",")
  , tags
  , tag
  , i
  , waitForAsync = (newTags.length -1) + 2
  , media = new Media();


  console.log("params: ", req.params);
  console.log("body: ", req.body);
  console.log("files: ", req.files);

  console.log("existingTags: ", existingTags);
  console.log("existingTags.length: ", existingTags.length);
  console.log("newTags: ", newTags);
  console.log("newTags.length: ", newTags.length);
  console.log("media: ", media);
  console.log("media.tags: ", media.tags);
  for (i = 1; i < newTags.length; i++) {
    console.log("i: ", i)
    tag = new Tag();
    tag.name = newTags[i];
    console.log("tag: ", tag);
    var saveTag = (function (t) {
      console.log("save tag")
      tag.save(function (err) {
        console.log("tag saved");
        console.log(t);
        media.tags.push(t._id);
        console.log("media: ", media);
        console.log("media.tags: ", media.tags);
        done();
      }); // CLOSE tag.save
    })(tag); // CLOSE saveTag
    
  }
  console.log("after loop");
  

  // TODO
  // Init on the media constructor
  media.name = filename;
  media.desc = description;  
  for (i = 1; i < existingTags.length; i++) {
    console.log("i: ", i)
    media.tags.push(new ObjectId(existingTags[i]));
  }

  options = {
    "content_type": file.type,
    metadata: {
      "info": "something useful",
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
    for (i = 0; i < media.tags.length; i++) {
      console.log("i: ", i);
      console.log("media.tags[" + i + "]: ", media.tags[i]);
      var findTag = (function (i) {
        console.log("findTag");
        Media.count( {tags: media.tags[i]}, function (err, count) {
          console.log("media find tag");
          console.log("err: ", err);
          console.log("count: ", count);
          if (count === 1) {
            console.log("count === 1");
            Tag.remove( {_id: media.tags[i]}, function (err) {
              console.log("tag remove");
              console.log("err: ", err);
            });
          }
        })
      })(i);
    }
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

