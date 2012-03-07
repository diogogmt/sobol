
var ip = '96.126.106.151',

		port = '8888',
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