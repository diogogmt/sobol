
//var ip = '96.126.106.151',
var ip = 'localhost',

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