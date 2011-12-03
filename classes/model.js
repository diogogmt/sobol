Job = function (options) {
    options = options || {};
    var id = options.id || 0;
    var name = options.name || "";
    var description = options.description || "";
    var creationDate = options.creationDate || new Date();
    var status = options.status || "Active"; // Alternatives are "Active", "Completed" and "Cancelled"
    var scheduleDates = options.scheduleDates || ""; // Delimited 
    var estimateSet = options.estimateSet || new Array();

    Object.defineProperty(this, "Id", {
        value: id,
        writable: false,
    });

    Object.defineProperty(this, "Name", {
        get: function () { return name; },
        set: function (newName) { name = newName; },
        enumerable: true,
    });

    Object.defineProperty(this, "Description", {
        get: function () { return description; },
        set: function (newDesc) { description = newDesc; },
        enumerable: true,
    });

    Object.defineProperty(this, "CreationDate", {
        get: function () { return creationDate; },
        set: function (newCreationDate) { creationDate = newCreationDate; },
        enumerable: true,
    });

    Object.defineProperty(this, "Status", {
        get: function () { return status; },
        set: function (newStatus) { status = newStatus; },
        enumerable: true,
    });

    Object.defineProperty(this, "ScheduleDates", {
        get: function () { return scheduleDates; },
        set: function (newScheduleDates) { scheduleDates = newScheduleDates; },
        enumerable: true,
    });

    Object.defineProperty(this, "EstimateSet", {
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