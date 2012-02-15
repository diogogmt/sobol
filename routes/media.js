

exports.all = function (req, res) {
	console.log("media all");

	res.render('media/media', 
    {
      layout: "includes/layout",
      title: 'Media',
      errors: false	
    }
  );
};

exports.one = function (req, res) {
	console.log("media one");
};

exports.search = function (req, res) {
	console.log("media search");
};

exports.create = function (req, res) {
	console.log("media create");
};

exports.update = function (req, res) {
	console.log("media update");
};

exports.save = function (req, res) {
	console.log("media save");
};

exports.delete = function (req, res) {
	console.log("media delete");
};

