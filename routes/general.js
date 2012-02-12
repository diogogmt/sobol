
var mongoose = require('mongoose')
  , models = require('./../models')
  , Schema = mongoose.Schema
  , email = require('./../email.js')
  , config = require('./../config')
  , loginValidator = require('./../validators').loginValidator;

models.defineModels(function() {
  User = mongoose.model('User');
})

exports.index = function(req, res) {
  res.redirect('/customers');
};

exports.auth = function (req, res) {
  console.log("auth route");

  loginValidator(req.body.user, function (errors) {
    console.log("loginValidator");
    if (!Object.keys(errors).length) {
      console.log("no errors");
      User.findOne({ username: req.body.user.username }, function(err, user) {
        console.log("user: ", user);
        console.log("err: ", err);
        if (user && user.authenticate(req.body.user.password)) {
          req.session.user_id = user.id;
          res.redirect("/customers");
        } 
        else {
          res.render('general/login', 
            {
              layout: "includes/layout",
              title: 'Login',
              errors: {credentials: "Wrong credentials"},
              user: req.body.user
            }
          );
        }
      }); 
    }
    else {
      res.render('general/login', 
        {
          layout: "includes/layout",
          title: 'Login',
          errors: errors,
          user: req.body.user
        }
      );
    }
  });
};


exports.login = function (req, res) {
  console.log("login route");
  res.render('general/login', 
    {
      layout: "includes/layout",
      title: 'Login',
      info: req.flash("info"),
      errors: false,
      user: false
    }
  );
}


exports.logout = function (req, res) {
  if (req.session) {
    req.session.destroy(function() {
    });
  }
  res.redirect('/login');
}
