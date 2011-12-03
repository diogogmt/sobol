Customer = function (options) {
	options = options || {};

	var id = options.id || 0;
	var postal = options.postal || "";
	
	var jobs = options.jobs || new Array();

	Object.defineProperty(this, "Id", {
		value: id,
		writable: false,
	});  

	Object.defineProperty(this, "Postal", {
		get: function () { return postal; },
		set: function (newPostal) { postal = newPostal; },
		enumerable: true,
	});

	Object.defineProperty(this, "Jobs", {
		get: function () { return jobs; },
		enumerable: true,
	});


};


Customer.prototype = {
	
	addJob: function (job) {
		if (job instanceof Job) {
			this.Jobs.push(job);
		}
	}

}

exports.Customer = Customer;


// Job
Job = function (options) {



};

exports.Job = Job;
