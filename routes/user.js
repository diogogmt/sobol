var mongoose = require('mongoose')
  , models = require('./../models')
  , Schema = mongoose.Schema;


models.defineModels(mongoose, function() {
  User = mongoose.model('User');
  db = mongoose.connect('mongodb://localhost/sobol-development');
});


// Users
exports.create = function(req, res) {
  res.render('users/new', {
    locals: { 
      layout: false,
      user: new User() 
    }
  });
};

exports.save = function(req, res) {
  console.log("create user");
  var user = new User(req.body.user);
  console.log("user: %o", user);
  function userSaveFailed() {
    console.log("creating NO");
    req.flash('error', 'Account creation failed');
    res.render('users/new.jade', {
      locals: { 
        layout: false,
        user: user 
      }
    });
  }

  user.save(function(err) {
    if (err) {
      console.log("err: " + err);
      return userSaveFailed();
    } 
    console.log("creating YES");
    req.flash('info', 'Your account has been created');
    //emails.sendWelcome(user);

    switch (req.params.format) {
      case 'json':
        console.log("case json");
        res.send(user.toObject());
      break;

      default:
        console.log("case default");
        req.session.user_id = user.id;
        res.redirect('/customers');
    }
  });
};