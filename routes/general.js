/*
 * GET home page.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
  username : String,
  password : String,
  type : String
});

UserSchema.statics.search = function search (opt, cb) {
  console.log("user search");
  console.log("opt: " + opt);
  console.log(opt);
  this.find({}, function (err, docs) {
    console.log("docs:");
    console.log(docs);
  });

  return this.findOne({
    user: opt.username,
    password: opt.password
    }, cb);
};  

mongoose.connect(
  'localhost',
  'sobol',
  '27017'
);

var User = mongoose.model('users', UserSchema);

exports.index = function(req, res) {
  if (!req.session || !req.session.user) {
    res.redirect('/login');
  }
  else {
    res.redirect('/customers');
  }
};

exports.auth = function (req, res) {
  console.log("auth route");
  
if(req.body.username == ""){
req.flash('usernameError', 'You must enter a username');  
}

if(req.body.password == ""){
req.flash('passwordError', 'You must enter a password');  
}

  User.search(
    {
      username: req.body.username,
      password: req.body.password
    }, 
    function (err, user) {
      console.log("callback");
      console.log(user);
      if (user) {
      console.log("auth");
      req.session.user = user;
      res.redirect('/');  
      }
      else {
        console.log("NOT auth");
        
        if(req.body.username != "" && req.body.password != ""){
            req.flash('loginError', 'Unable to login, incorrect username or password');
            }

        res.redirect('/login');
      }
    }
  );
}


exports.login = function (req, res) {
  console.log("login route");
  res.render('general/login', 
    {
      layout: "includes/layout",
      title: 'Login',
      usernameError: req.flash("usernameError"),
      passwordError: req.flash("passwordError"),
      loginError: req.flash("loginError"),
      emailError: req.flash("emailError"),
      user: new User()
    }
  );
}


exports.logout = function (req, res) {
  console.log("login route");
  res.render('customer/customers', 
    {
      title: 'Customers'
    }
  );
}
