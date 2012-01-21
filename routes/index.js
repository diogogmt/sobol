/*
 * GET home page.
 */

<<<<<<< HEAD

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
	console.log("login route");
	res.render('login', 
		{
			title: 'Login'
		});
}

exports.auth = function (req, res) {
	console.log("auth route");
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
				res.redirect('/login');
			}
		}
	);
	
}
=======
exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};
>>>>>>> 3ae5c984663a8435609f03b3b4d490fb9dd82a77
