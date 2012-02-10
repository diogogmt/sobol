var mongoose = require('mongoose')
  , models = require('./../models')
  , bcrypt = require('bcrypt')
  , domain = 'http://localhost:11342/'
  , email = require('./../email.js')
  , config = require('./../config')
  , userValidator = require('./../validators.js').userValidator
  , check = require('validator').check
  , sanitize = require('validator').sanitize
  , Schema = mongoose.Schema;




models.defineModels(function() {
  User = mongoose.model('User');
});


// Users
exports.newUser = function(req, res) {
  res.render('users/new', {
    locals: { 
      layout: false,
      user: new User() 
    }
  });
};

exports.create = function(req, res, next) {
  console.log("create user");
  console.log("next: ", next);
  // var user = new User(req.body.user);
  // //console.log("user: \n", user);

  // function userSaveFailed() {
  //   // console.log("\nFAIL!\n");
  //   // req.flash('error', 'Account creation failed');
  //   // res.render('users/new.jade', {
  //   //   locals: { 
  //   //     layout: false,
  //   //     user: user 
  //   //   }
  //   // });
  //   res.redirect('/user/create');
  // }
  // User.count({}, function (err, count) {
  //   console.log("Collection has " + count + " users");
  //   user.id = count + 1;
  //   user.save(function(err) {
  //     if (err) {
  //       console.log("\nerr: \n", err);
  //       return userSaveFailed();
  //     } 
  //     console.log("\nSUCCESS\n");
  //     req.flash('info', 'Your account has been created');
  //     //emails.sendWelcome(user);

  //     switch (req.params.format) {
  //       case 'json':
  //         // console.log("case json");
  //         res.send(user.toObject());
  //       break;

  //       default:
  //         // console.log("case default");
  //         req.session.user_id = user.id;
  //         res.redirect('/customers');
  //     }
  //   });
  // })
};

exports.forgot = function (req, res) {
  console.log("forgot");
  User.findOne({ email: req.body.user.email }, function(err, user) {
    console.log("user: ", user);
    if (user) {
      console.log('user: %o' + user);
      var bcrypt = require('bcrypt')  
        , salt = bcrypt.genSaltSync(10)
        , hash = bcrypt.hashSync(user.email, salt)
        , expire = new Date(Date.now() + 86400000)
        , link = domain + 'user/reset/' + user._id + '/' + encodeURIComponent(expire);


      var options = {
        message: {
          sender: 'Sobol INC <sobolinc@gmail.com>',
          to: '"Diogo Golovanevsky" <diogo.gmt@gmail.com> ',
          subject: 'Message from Dandasoft',

          body: 'Client message<br />' + link,
          // debug: true,
          
        },
        // Callback to be run after the sending is completed
        callback: function(error, success){
          if(error){
              console.log('Error occured');
              console.log(error.message);
              return;
          }
          if(success){
              console.log('Message sent successfully!');
          }else{
              console.log('Message failed, reschedule!');
          }
        }
      }

      email.send(options);
      req.flash('info', 'Instructions sent to your email');
      res.redirect('/login');
    } 
    else {
      req.flash('info', 'Email not registered');
      res.redirect('/login');
    }
  }); 
};


exports.reset = function (req, res) {
  var id = req.params.id
    , ts = decodeURIComponent(req.params.ts);

  if (ts < Date(Date.now())) {
    res.render('users/reset', {
      locals: { 
        layout: false,
        id: id
      }
    });
  }
}


exports.validateUser = function (req, res, next) {
  console.log("validateUser ROUTE");
  var errors = userValidator(req.body.user, function (err) {
    console.log('err: ', err);
    console.log("err.length: ", Object.keys(err).length);
    if (Object.keys(err).length) {
      res.render('users/new', {
        locals: { 
          layout: false,
          user: new User(),
          err: err 
        }
      });
      return false;
      // next(new Error("Validate user error"));
    }
    console.log("next: ", next);
    // next();  
  });
  
}
