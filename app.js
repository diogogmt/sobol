
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
app.get('/', loadUser, routes.general.index);

// Login
app.get('/login', routes.general.login);
app.post('/login', routes.general.auth);
app.get('/logout', loadUser, routes.general.logout);

// Customer

app.get('/customers', loadUser, routes.customer.all);
app.post('/customer/add', loadUser, routes.customer.validateCustomer, routes.customer.add);
app.post('/customer/edit', loadUser, routes.customer.validateEditCustomer, routes.customer.edit);
app.get('/customer/:id', loadUser, routes.customer.details);
app.get('/datatable/customer/findAll', loadUser, routes.customer.findAll);
app.get('/datatable/customer/findActive', loadUser, routes.customer.findActive);

// Customer Notes
app.get('/customer/notes/:id', loadUser, routes.note.all);
app.post('/customer/note/add/:id', loadUser, routes.note.add);
app.get('/customer/:custid/note/delete/:noteid', loadUser, routes.note.delete);
app.get('/datatable/customer/getCustomerNotes/:id', loadUser, routes.note.getCustomerNotes);
app.get('/note/:id', loadUser, routes.note.details);

//app.post('/customer/note/edit', loadUser, routes.note.edit);
//app.get('/customer/note/:id', loadUser, routes.note.details);


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
app.get('/media/tags', routes.media.tags);
app.post('/media/search', routes.media.search);
app.post('/media/create', routes.media.create);
app.post('/media/edit', routes.media.edit);
app.post('/media/delete', routes.media.delete);
app.get('/media/:id', routes.media.one);
// Tags


console.log("routes/media/tags ", routes.media.tags);




//Tags
app.get('/tags/get', routes.tag.get);
app.get('/media/:id/tag/create', loadUser, routes.tag.create);
app.post('/media/:id/tag/delete/:id', loadUser, routes.tag.delete);



// Job
app.get('/jobs', loadUser, routes.job.all);
app.get('/jobs/calendar', loadUser, routes.job.calendar);
app.get('/jobs/calendarData', loadUser, routes.job.calendarData);
app.get('/datatable/job/getCustJobs/:id', loadUser, routes.job.getCustJobs);
app.get('/datatable/job/findAll', loadUser, routes.job.findAll);

app.post('/job/add/:id', loadUser, routes.job.validateJob, routes.job.add);
//app.post('/job/add/:id', loadUser, routes.job.add);
app.post('/job/edit', loadUser, routes.job.validateEditJob, routes.job.edit);
//app.post('/job/edit', loadUser, routes.job.edit);


app.get('/job/:id', loadUser, routes.job.details);

// test data generation
app.get('/test', routes.test.generate);

// Estimate
app.get('/datatable/estimate/getJobEstimates/:id', loadUser, routes.estimate.getJobEstimates);
app.post('/estimate/add/:id', loadUser, routes.estimate.add);
app.post('/estimate/edit', loadUser, routes.estimate.edit);
app.get('/job/:jobId/estimate/:estimateId', loadUser, routes.estimate.details);

// Line Item
app.get('/datatable/getLineItems/:jobId/:estimateId', loadUser, routes.lineItem.getLineItems);
app.post('/estimate/addLineItem/:jobId/:estimateId', loadUser, routes.lineItem.add);

if (!module.parent) {
  app.listen(11342);
    console.log('Express server listening on port %d, environment: %s', 
    app.address().port, app.settings.env);
  console.log('Using connect %s, Express %s, Jade %s', connect.version,
    express.version, jade.version);
}

