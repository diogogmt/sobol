
var mongoose = require('mongoose')
  , models = require('./../models')
  , Schema = mongoose.Schema
  , email = require('./../email.js')
  , config = require('./../config');

models.defineModels(function() {
  User = mongoose.model('User');
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
  User.findOne({ username: req.body.user.username }, function(err, user) {
    if(req.body.user.username != '' && req.body.user.password != ''){
      if (user && user.authenticate(req.body.user.password)) {
        req.session.user_id = user.id;

        var options = {
          message: {
            sender: 'Sobol INC <sobolinc@gmail.com>',
            to: '"Diogo Golovanevsky" <diogo.gmt@gmail.com> ',
            subject: 'Message from Dandasoft',

            body: 'Client message',
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

        //email.send(options);


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
    }else{
      if(req.body.user.username == ""){
        req.flash('usernameError', '* You must enter a username');
        res.redirect('/login');
      }else if(req.body.user.password == ""){
        req.flash('passwordError', '*You must enter a password');
        res.redirect('/login');
      }
    }
  }); 
}


exports.login = function (req, res) {
  res.render('general/login', 
    {
      layout: "includes/layout",
      title: 'Login',
      info: req.flash("info"),
      usernameError: req.flash("usernameError"),
      passwordError: req.flash("passwordError"),
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
