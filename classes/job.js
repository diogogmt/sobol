function job(){
	var jobID = 0;
	var jobName = "";
	var jobDescription = "";
	var jobCreationDate = new Date();
	var jobStatus = "Active";
	var jobScheduleDates = "";
	var jobEstimateSet = new Array();
}

this.getJobID = function(){
	return this.jobID;
}

this.getJobName = function(){
	return this.jobName;
}

this.getJobDescription = function(){
	return this.jobDescription;
}

this.getJobCreationDate = function(){
	return this.jobCreationDate;
}

this.getJobStatus = function(){
	return this.jobStatus;
}

this.getJobScheduleDates = function(){
	return this.jobScheduleDates;
}

this.getJobEstimateSet = function(){
	return this.jobEstimateSet;
}

exports.Job = function () {
    this.jobStatus = 'Active';
};
exports.Job.prototype = {
    isActive: function () { return true }
};




// cannot add estimate if status is locked
// check how many estimates are in the set