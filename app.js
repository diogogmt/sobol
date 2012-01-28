
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'sobol' }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.set('view options', { pretty: true });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

console.log("routes: " + routes);
console.log("customer route: " + routes.customer);
console.log("general route: " + routes.general);

// Routes

app.get('/', routes.general.index);

app.get('/login', routes.general.login);

app.post('/auth', routes.general.auth);

app.get('/customers', routes.customer.all);

app.get('/customers/add', routes.customer.add);



app.listen(3000);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
