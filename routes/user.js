var mongoose = require('mongoose')
  , models = require('./../models')
  , bcrypt = require('bcrypt')
  , domain = 'http://localhost:11342/'
  , email = require('./../email.js')
  , Schema = mongoose.Schema;


models.defineModels(mongoose, function() {
  User = mongoose.model('User');
  db = mongoose.connect('mongodb://96.126.106.151:27017/sobol');
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

exports.forgot = function (req, res) {
  console.log("forgot");
  User.findOne({ email: req.body.user.email }, function(err, user) {
    console.log("user: %o", user);
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
