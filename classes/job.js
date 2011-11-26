exports.Job = function (job) {
    job = job || {};
    this.id = job.id || 0;
	this.name = job.name || "";
	this.description = job.description || "";
	this.creationDate = job.creationDate || new Date();
	this.status = job.status || "Active"; // Alternative is "Archived"
	this.scheduleDates = job.scheduleDates || ""; // Delimited 
	this.estimateSet = job.estimateSet || new Array();
};

exports.Job.prototype = {
    getID: function() { return this.id; }
    getName: function() { return this.name; }
    getDescription: function() { return this.description; }
    getCreationDate: function() { return this.creationDate; }
    getStatus: function() { return this.status; }
    getScheduledDates: function() { return this.getScheduledDates; }
    getEstimateSet: function() { return this.estimateSet; }

    setID: function(id) { this.id = id; }
    setName: function(name) { this.name = name; }
    setDescription: function(description) { this.description = description; }
    setCreationDate: function(creationDate) { this.creationDate = creationDate; }
    setStatus: function(status) { this.status = status; }
    setScheduleDates: function(scheduleDates) { this.scheduleDates = scheduleDates; }
    setEstimateSet: function() { this.estimateSet = estimateSet; }

    addScheduleDate: function() {  }
    addEstimate: function(options) { 
	    estimate = new Estimate(options);
	    estimateSet.push(estimate);
    }

    isActive: function() { return this.jobStatus === "Active"; }
    getNumOfEstimates: function() { return estimateSet.length; }
};


// can not add estimate if status is locked
// check how many estimates are in the set


/*
this.getID = function(){
	return this.id;
}

this.getName = function(){
	return this.name;
}

this.getDescription = function(){
	return this.description;
}

this.getCreationDate = function(){
	return this.creationDate;
}

this.getStatus = function(){
	return this.status;
}

this.getScheduleDates = function(){
	return this.scheduleDates;
}

this.getEstimateSet = function(){
	return this.estimateSet;
}
*/