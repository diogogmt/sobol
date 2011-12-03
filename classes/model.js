Job = function (options) {
    options = options || {};
    var id = options.id || 0;
    var name = options.name || "";
    var description = options.description || "";
    var creationDate = options.creationDate || new Date();
    var status = options.status || "Active"; // Alternatives are "Active", "Completed" and "Cancelled"
    var scheduleDates = options.scheduleDates || new Array();
    var estimateSet = options.estimateSet || new Array();

    Object.defineProperty(this, "Id", {
        get: function() { return id; },
        set: function(newId) { id = newId; },
        enumerable: true,
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
        var isAdded = false;
        if (estimate instanceof Estimate) {
            if (this.Status === "Active"){
                this.EstimateSet.push(estimate);
                isAdded = true;
            }
        }
        return isAdded;
    },
    addEstimateWithOptions: function (options) {
        var isAdded = false;
        if(this.Status === "Active"){
            var estimate = new Estimate(options);
            this.EstimateSet.push(estimate);
            isAdded = true;
        }
        
        return isAdded;
    },
    addScheduleDate: function(date) {
        this.ScheduleDates.push(date);
    },
    setStatus: function(status) {
        var isSet = false;
        var hasInFuture = false;
        console.log("new instance");
        if(status === "Completed")
        {
            var currentDate = new Date();
            console.log("schedule dates is length: " + this.ScheduleDates.length);
            for(i=0; i<this.ScheduleDates.length; i++)
            {
                console.log(this.ScheduleDates[i]);
                var scheduledDate = new Date(this.ScheduleDates[i]);
                console.log("sched date in future: " + (scheduledDate > currentDate));
                if(scheduledDate > currentDate){
                    hasInFuture = true;
                    break;
                }
            }
            if(!hasInFuture){
                this.Status = status;
                isSet = true;
            }
        }else{
            this.Status = status;
            isSet = true;
        }
        return isSet;
    },
    getNumOfEstimates: function() {
        return this.estimateSet.length;
    }
}

exports.Job = Job;

Estimate = function (){
    
};

exports.Estimate = Estimate;