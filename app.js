
/**
 * Module dependencies.
 */

var express = require('express')
  , MongoStore = require('connect-mongo')
  , connectTimeout = require('connect-timeout')
  , mongoStore = require('connect-mongodb')
  , stylus = require('stylus')
  , im = require('imagemagick')
  , mongoose = require('mongoose')
  , connect = require('connect')
  , jade = require('jade')
  , routes = require('./routes')
  , config = require('./config')
  , gridfs = require("./gridfs")
  , User = require('./models').User
  , Media = require('./models').Media;


var app = module.exports = express.createServer();


// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(connect.bodyParser({uploadDir:'./uploads'}));
  app.use(express.cookieParser());
  app.use(connectTimeout({ time: 100000 }));
  app.use(express.session({ store: mongoStore(app.set('db-uri')),
    secret: 'topsecret' }));
  app.use(express.logger({ format:
    '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
  app.use(express.methodOverride());
  app.use(stylus.middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  app.set('mailOptions', {
    host: 'localhost',
    port: '25',
    from: 'nodepad@example.com'
  });
  app.set('view options', {
    pretty: true
  });
  app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
  // Serve static files
  app.use("/public", express.static("./public"));
});



function loadUser(req, res, next) {
  console.log("loaduser");
  if (req.session.user_id) {
    User.findOne({_id: req.session.user_id}, function(err, user) {
      if (user) {
        req.currentUser = user;
        next();
      }
      else {
        res.redirect('/login');
      }
    });
  }
  else {
    res.redirect('/login');
  }
}

// Routes

// Index
// app.get('/', loadUser, routes.general.index);

// Login
app.get('/login', routes.general.login);
app.post('/login', routes.general.auth);
app.get('/logout', loadUser, routes.general.logout);

// Customer
app.get('/customers', loadUser, routes.customer.all);
app.post('/customer/add', loadUser, routes.customer.add);
app.post('/customer/edit', loadUser, routes.customer.edit);
app.get('/customer/:id', loadUser, routes.customer.details);
app.get('/datatable/customer/findAll', loadUser, routes.customer.findAll);

// User
app.get('/user/create', routes.user.create);
app.post('/user/create', routes.user.validateUser, routes.user.save);
// Post Reset
app.post('/user/forgot', routes.user.forgot);
// Get Reset
app.get('/user/reset/:id/:ts', routes.user.reset);


app.get('/media/get', routes.media.get);

// Media
app.get('/media', routes.media.all);
app.get('/media/:id', routes.media.one);
app.post('/media/search', routes.media.search);
app.post('/media/create', routes.media.create);
app.get('/media/update/:id', loadUser, routes.media.update);
app.post('/media/update/:id', loadUser, routes.media.save);
app.post('/media/delete', routes.media.delete);




//Tags
app.get('/tags/get', routes.tag.get);
app.get('/media/:id/tag/create', loadUser, routes.tag.create);
app.post('/media/:id/tag/delete/:id', loadUser, routes.tag.delete);



// Job
app.get('/jobs', loadUser, routes.job.all);
app.get('/datatable/job/getCustJobs/:id', loadUser, routes.job.getCustJobs);
app.get('/datatable/job/findAll', loadUser, routes.job.findAll);
app.post('/job/add/:id', loadUser, routes.job.add);
app.post('/job/edit', loadUser, routes.job.edit);
app.get('/job/:id', loadUser, routes.job.details);




app.get("/", function(req, res) {
  console.log("root");
  return Media.find({}, function(err, files) {
    console.log("files: ", files)
    console.log("err: ", err)
    return res.render("gridIndex", {
      layout: false,
      title: "GridFS Example",
      files: files
    });
  });

});

app.post("/new", function(req, res) {
  var media
    , options
    , thumbnail
    , finish = 0
    , file = req.files.file
    , filename = req.body.name
    , media = new Media();

  // TODO
  // Init on the media constructor
  media.name = filename;
  media.desc = "media description";

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
    if (++finish === 2) {
      media.save(function (err) {
        console.log("err: ", err);
        // Do something if error happens
        return res.redirect("/");
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

    gridfs.putFile(filename, file.path, options,
     function(err, result) {
      media.src = result._id;
      done();
    });

    gridfs.putFile(thumbnail.filename, thumbnail.path, options,
     function(err, result) {
      media.thumbnail = result._id;
      done();
    });
  });

});

app.get("/file/:id", function(req, res) {
  console.log("/id");
  return gridfs.get(req.params.id, function(err, file) {
    res.header("Content-Type", file.type);
    res.header("Content-Disposition", "attachment; filename=" + file.filename);
    return file.stream(true).pipe(res);
  });
});



if (!module.parent) {
  app.listen(11342);
    console.log('Express server listening on port %d, environment: %s', 
    app.address().port, app.settings.env);
  console.log('Using connect %s, Express %s, Jade %s', connect.version,
    express.version, jade.version);
}

