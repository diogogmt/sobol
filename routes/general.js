
var mongoose = require('mongoose')
  , models = require('./../models')
  , Schema = mongoose.Schema;


models.defineModels(mongoose, function() {
  User = mongoose.model('User');
  LoginToken = mongoose.model('LoginToken');
  db = mongoose.connect('mongodb://localhost/sobol-development');
})


exports.index = function(req, res) {
  if (!req.session || !req.session.user) {
    res.redirect('/login');
  }
  else {
    res.redirect('/customers');
  }
};

exports.auth = function (req, res) {
  User.findOne({ email: req.body.user.email }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user_id = user.id;
      // Remember me
      if (req.body.remember_me) {
        var loginToken = new LoginToken({ email: user.email });
        loginToken.save(function() {
          res.cookie('logintoken', loginToken.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
          res.redirect('/customers');
        });
      } 
      else {
        res.redirect('/customers');
      }
    } 
    else {
      req.flash('info', 'Incorrect credentials');
      res.redirect('/login');
    }
  }); 
}


exports.login = function (req, res) {
  res.render('general/login', 
    {
      layout: "includes/layout",
      title: 'Login',
      info: req.flash("info"),
      user: new User()
    }
  );
}


exports.logout = function (req, res) {
  if (req.session) {
    LoginToken.remove({ email: req.currentUser.email }, function() {});
    res.clearCookie('logintoken');
    req.session.destroy(function() {
    });
  }
  res.redirect('/login');
}
