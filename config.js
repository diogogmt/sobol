
//var ip = '96.126.106.151',
<<<<<<< HEAD
var ip = 'localhost',

=======
var ip = '127.0.0.1',

//		port = '8888',
>>>>>>> remotes/DennisRepo/master
		port = '27017',
		db =	'sobol';

exports.mongo = {
	conf: {
		ip: ip,
		port: port,
		db:	db
	},
	connectionString: 'mongodb://' + ip + ':' + port + '/' + db,
};

exports.salt = 'sobolinc2012';