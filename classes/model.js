Job = function (options) {
    job = job || {};
    var id = job.id || 0;
    var name = job.name || "";
    var description = job.description || "";
    var creationDate = job.creationDate || new Date();
    var status = job.status || "Active"; // Alternatives are "Active", "Completed" and "Cancelled"
    var scheduleDates = job.scheduleDates || ""; // Delimited 
    var estimateSet = job.estimateSet || new Array();

    Object.defineProperty(this, "Id", {
        value: id,
        writable: false,
    });

    Object.defineProperty(this, "name", {
        get: function () { return name; },
        set: function (newName) { name = newName; },
        enumerable: true,
    });

    Object.defineProperty(this, "description", {
        get: function () { return description; },
        set: function (newDesc) { description = newDesc; },
        enumerable: true,
    });

    Object.defineProperty(this, "creationDate", {
        get: function () { return creationDate; },
        set: function (newCreationDate) { creationDate = newCreationDate; },
        enumerable: true,
    });

    Object.defineProperty(this, "status", {
        get: function () { return status; },
        set: function (newStatus) { status = newStatus; },
        enumerable: true,
    });

    Object.defineProperty(this, "scheduleDates", {
        get: function () { return scheduleDates; },
        set: function (newScheduleDates) { scheduleDates = newScheduleDates; },
        enumerable: true,
    });

    Object.defineProperty(this, "estimateSet", {
        get: function () { return estimateSet; },
        set: function (newEstimateSet) { estimateSet = newEstimateSet; },
        enumerable: true,
    });
};

Job.prototype = {
    addEstimate: function (estimate) {
        if (estimate instanceof Estimate) {
            this.estimateSet.push(estimate);
        }
    },
    addEstimateWithOptions: function (options) {
        var estimate = new Estimate(options);
        this.estimateSet.push(estimate);
    },
    addScheduleDate: function() {
        
    },

    isActive: function() {
        return this.status === "Active";
    },
    getNumOfEstimates: function() {
        return this.estimateSet.length;
    }
}

exports.Job = Job;