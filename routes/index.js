/*
 * GET home page.
 */


var 
  mongoose = require('mongoose'),
  Schema = mongoose.Schema
  ;
  
var UserSchema = new Schema({
	username : String,
	password : String,
	type : String
});

UserSchema.statics.search = function search (opt, cb) {
	console.log(opt);
	return this.findOne({
		user: opt.username,
		password: opt.password
		}, cb);
};	

mongoose.connect(
	'localhost',
	'sobol',
	'29017'
);

var User = mongoose.model('users', UserSchema);


exports.index = function(req, res) {
	if (!req.session || !req.session.user) {
		res.redirect('/login');
	}
	else {
	  res.render('customer', { title: 'Customer' })
	}
};

exports.login = function (req, res) {
	res.render('login', 
		{
			title: 'Login'
		});
}

exports.auth = function (req, res) {
	User.search(
		{
			username: req.body.email,
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
				res.redirect('/login');
			}
		}
	);
	
}
