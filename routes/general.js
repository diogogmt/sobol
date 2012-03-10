
var mongoose = require('mongoose')
  , User = require('./../models').User
  , Schema = mongoose.Schema
  , email = require('./../email.js')
  , config = require('./../config')
  , loginValidator = require('./../validators').loginValidator;


exports.index = function(req, res) {
  res.redirect('/customers');
};

exports.auth = function (req, res) {
  //console.log("auth route");

  loginValidator(req.body.user, function (errors) {
    //console.log("loginValidator");
    if (!Object.keys(errors).length) {
      //console.log("no errors");
      User.findOne({ username: req.body.user.username }, function(err, user) {
        //console.log("user: ", user);
        //console.log("err: ", err);
        //console.log("user id: " + user._id);
        if (user && user.authenticate(req.body.user.password)) {
          req.session.user_id = user._id;
          res.redirect("/customers");
        } 
        else {
          res.render('general/login', 
            {
              layout: "includes/layout",
              title: 'Login',
              errors: {credentials: "Incorrect username/password. Please try again."},
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
  //console.log("login route");
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

