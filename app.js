
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , MongoStore = require('connect-mongo')
  , mongo = require('mongoose')
  , connectTimeout = require('connect-timeout')
  , mongoStore = require('connect-mongodb')
  , stylus = require('stylus')
  , mongoose = require('mongoose')
  , connect = require('connect')
  , jade = require('jade')
  , routes = require('./routes')
  , config = require('./config')
  , models = require('./models');


var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(connectTimeout({ time: 10000 }));
  app.use(express.session({ store: mongoStore(app.set('db-uri')), secret: 'topsecret' }));
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }))
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
});


models.defineModels(function() {
  app.User = User = db.model('User');
})


function loadUser(req, res, next) {
  console.log("loaduser");
  if (req.session.user_id) {
    User.findOne({id: req.session.user_id}, function(err, user) {
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
app.get('/logout', loadUser, routes.general.logout);

// Customer
app.get('/customers', loadUser, routes.customer.all);
app.post('/customer/add', loadUser, routes.customer.add);
app.get('/customer/:id', loadUser, routes.customer.details);
app.get('/datatable/customer/findAll', routes.customer.findAll);

// Jobs
//app.get('/datatable/customer/:id/jobs', routes.job.findByCustID);

// User
app.get('/user/create', routes.user.create);
app.post('/user/create', routes.user.validateUser, routes.user.save);
// Post Reset
app.post('/user/forgot', routes.user.forgot);
// Get Reset
app.get('/user/reset/:id/:ts', routes.user.reset);

// Job
app.get('/jobs', loadUser, routes.job.all);
app.get('/datatable/job/findAll', routes.job.findAll);
app.post('/job/add', routes.job.add);
//app.get('/job/:id', routes.job.details);

if (!module.parent) {
  app.listen(11342);
  console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env)
  console.log('Using connect %s, Express %s, Jade %s', connect.version, express.version, jade.version);
}

