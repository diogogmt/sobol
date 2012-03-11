
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
  //console.log("loaduser");
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
app.get('/', routes.general.index);

// Login
app.get('/login', routes.general.login);
app.post('/login', routes.general.auth);
app.get('/logout', routes.general.logout);

// Customer

app.get('/customers', routes.customer.all);

app.get('/customer/:id', routes.customer.details);
app.post('/customer/add', routes.customer.validateCustomer, routes.customer.add);
app.post('/customer/edit', routes.customer.validateEditCustomer, routes.customer.edit);

app.get('/datatable/customer/findAll', routes.customer.findAll);
app.get('/datatable/customer/findActive', routes.customer.findActive);

// Customer Notes
app.get('/customer/notes/:id', routes.note.all);
app.post('/customer/note/add/:id', routes.note.add);
app.get('/customer/:custid/note/delete/:noteid', routes.note.delete);

app.get('/note/:id', routes.note.details);

app.get('/datatable/customer/getCustomerNotes/:id', routes.note.getCustomerNotes);

//app.post('/customer/note/edit', routes.note.edit);
//app.get('/customer/note/:id', routes.note.details);


// Job
app.get('/jobs', routes.job.all);

app.get('/job/:id', routes.job.details);

app.post('/job/add/:id', routes.job.validateJob, routes.job.add);
app.post('/job/edit', routes.job.validateEditJob, routes.job.edit);


app.get('/datatable/job/getCustJobs/:id', routes.job.getCustJobs);
app.get('/datatable/job/findAll', routes.job.findAll);



// Estimate
app.get('/job/:jobId/estimate/:estimateId', routes.estimate.details); // we don't need jobID
app.post('/estimate/add/:id', routes.estimate.add);
app.post('/estimate/edit', routes.estimate.edit);

app.get('/datatable/estimate/getJobEstimates/:id', routes.estimate.getJobEstimates);


// Line Item
app.post('/estimate/addLineItem/:jobId/:estimateId', routes.lineItem.add);
app.get('/datatable/getLineItems/:jobId/:estimateId', routes.lineItem.getLineItems);


// Media
app.get('/media', routes.media.all);
app.get('/media/tags', routes.media.tags);
app.post('/media/search', routes.media.search);
app.post('/media/create', routes.media.create);
app.post('/media/edit', routes.media.edit);
app.post('/media/delete', routes.media.delete);
app.get('/media/:id', routes.media.one);
app.get('/media/get', routes.media.get);

// Tags
app.get('/tags/get', routes.tag.get);
app.get('/media/:id/tag/create', routes.tag.create);
app.post('/media/:id/tag/delete/:id', routes.tag.delete);



// User
app.get('/user/create', routes.user.create);
app.post('/user/create', routes.user.validateUser, routes.user.save);
// Post Reset
app.post('/user/forgot', routes.user.forgot);
// Get Reset
app.get('/user/reset/:id/:ts', routes.user.reset);

if (!module.parent) {
  app.listen(11342);
    console.log('Express server listening on port %d, environment: %s', 
    app.address().port, app.settings.env);
  console.log('Using connect %s, Express %s, Jade %s', connect.version,
    express.version, jade.version);
}

