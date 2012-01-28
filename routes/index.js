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

var CustomerSchema = new Schema({
	id : Number,
	firstName : String,
	lastName : String,
	email : String,
	phone1 : String,
	phone2 : String,
	street1 : String,
	street2 : String,
	postal : String,
	city : String,
	province : String,
	country : String,
	registrationDate : Date,
	status : String
});

CustomerSchema.statics.search = function search (opt, cb) {
	console.log("customer search");
	console.log("opt: " + opt);
	this.find({}, function(err, docs) {
		console.log("docs:");
		console.log(docs);
	});

	return this.findOne({
		id : opt.id
		}, cb);
};

CustomerSchema.statics.findAll = function findAll(opt, cb) {
	return this.find({}, cb);
};

mongoose.connect(
	'localhost',
	'sobol',
	'27017'
);

var User = mongoose.model('users', UserSchema);
var Customer = mongoose.model('customer', CustomerSchema);

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

exports.customer = function (req, res) {
	console.log("customer route");
	Customer.findAll({}, function (err, customers) {
		console.log("customer callback");
		if(customers){
			console.log("success");
			console.log(customers);

			var dataSet = new Array();
			for(i = 0; i < customers.length; i++){
				dataSet.push([
            customers[i].id,
            customers[i].firstName + ' ' + customers[i].lastName,
            customers[i].email,
            customers[i].phone1,
            0,
            customers[i].status
				]);
			}

      var aaData = {
        "aaData" : dataSet
      };

      res.json(aaData);
		}else{
			console.log("Not success");
		}
	});
}