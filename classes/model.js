// Customer class
Customer = function (options) {
  options = options || {};

  var id = options.id || 0;
  var fname = options.fname || "";
  var lname = options.lname || "";
  var email = options.email || "";
  var phone = options.phone || "";
  var street1 = options.street1 || "";
  var street2 = options.street2 || "";
  var postal = options.postal || "";

  var d = new Date();
  var date = options.date || d.getDay() + '-' + d.getDate() + '-' + d.getFullYear();

  var status = options.status || 'active';

  var notes = options.notes || new Array();
  var jobs = options.jobs || new Array();

  Object.defineProperty(this, "Id", {
    get: function () { return id; },
    set: function (newId) { id = newId; },
    enumerable: true,
  });  

  Object.defineProperty(this, "FirstName", {
    get: function () { return fname; },
    set: function (newFirstName) { fname = newFirstName; },
    enumerable: true,
  });

  Object.defineProperty(this, "LastName", {
    get: function () { return lname; },
    set: function (newLastName) { lname = newLastName; },
    enumerable: true,
  });

  Object.defineProperty(this, "Email", {
    get: function () { return email; },
    set: function (newEmail) { email = newEmail; },
    enumerable: true,
  });

  Object.defineProperty(this, "Phone", {
    get: function () { return phone; },
    set: function (newPhone) { phone = newPhone; },
    enumerable: true,
  });

  Object.defineProperty(this, "Street1", {
    get: function () { return street1; },
    set: function (newStreet1) { street1 = newStreet1; },
    enumerable: true,
  });

  Object.defineProperty(this, "Street2", {
    get: function () { return street2; },
    set: function (newStreet2) { street2 = newStreet2; },
    enumerable: true,
  });

  Object.defineProperty(this, "Postal", {
    get: function () { return postal; },
    set: function (newPostal) { postal = newPostal; },
    enumerable: true,
  });

  Object.defineProperty(this, "Date", {
    get: function () { return date; },
    set: function (newDate) { date = newDate; },
    enumerable: true,
  });

  Object.defineProperty(this, "Status", {
    get: function () { return status; },
    set: function (newStatus) { status = newStatus; },
    enumerable: true,
  });

  Object.defineProperty(this, "Jobs", {
    get: function () { return jobs; },
    enumerable: true,
  });

  Object.defineProperty(this, "Notes", {
    get: function () { return notes; },
    enumerable: true,
  });
};


Customer.prototype = {
  
  addJob: function (job) {
    // console.log("addJob");
    // console.log("this.Status: " + this.Status);
    if (job instanceof Job && this.Status === 'active') {
      this.Jobs.push(job);
    }
  },
  deleteJob: function (jobId) {
    var i,
        jobs = this.Jobs,
        jobsLength = this.totalJobs()
    ;
    // console.log("\n\ndeleteJob");
    // console.log("jobId: " + jobId);
    // console.log("jobsLength: " + jobsLength);
    // console.log("this.Jobs.length: " + this.Jobs.length);
    for (i = 0; i < jobsLength; i++) {
      // console.log("i: " + i);
      // console.log("jobs[" + i + "].Id: " + jobs[i].Id);
      if (jobs[i].Id == jobId) {
        // console.log("jobs[" + i + "].Id: " + jobs[i].Id + " == " + jobId);
        // console.log("jobsLength: " + jobsLength);
        // console.log("jobs[i].getNumOfEstimates(): " + jobs[i].getNumOfEstimates());
        if (jobs[i].getNumOfEstimates() === 0) {
          // console.log("splicing job");
          jobs = jobs.splice(i, 1);
        }
        // console.log("this.totalJobs(): " + this.totalJobs());
        break;
      }
    }
  },
  totalJobs: function () {
    return this.Jobs.length;
  },

  addNote: function (note) {
    if (note instanceof Note) {
      this.Notes.push(note);
    }
  },
  deleteNote: function (noteId) {
    var i,
        notes = this.Notes,
        notesLength = this.totalNotes()
    ;
    // console.log("deleteNote");
    // console.log("noteId: " + noteId);
    for (i = 0; i < notesLength; i++) {
      // console.log("i: " + i);
      // console.log("notes[" + i + "].Id: " + notes[i].Id);
      if (notes[i].Id == noteId) {
        // console.log("notes[" + i + "].Id: " + notes[i].Id + " == " + noteId);
        // console.log("notesLength: " + notesLength);
        notes = notes.splice(i, 1);
        // console.log("this.totalNotes(): " + this.totalNotes());
        break;
      }
    }
  },
  totalNotes: function () {
    return this.Notes.length;
  }

};





// Job  Class
Job = function (options) {
    options = options || {};
    var id = options.id || 0;
    var name = options.name || "";
    var description = options.description || "";
    var creationDate = options.creationDate || "";
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
        if(status === "Completed")
        {
            var currentDate = new Date();
            for(i=0; i<this.ScheduleDates.length; i++)
            {
                var scheduledDate = new Date(this.ScheduleDates[i]);
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
        return this.EstimateSet ? this.EstimateSet.length : 0;
    }
}







// Estimate class
Estimate = function (options) {
    options = options || {};

  var ID = options.ID || 0; //some Mongo DB method for assigning ID should go here
  var Subtotal = options.Subtotal || 0;
  var FinalTotal = options.FinalTotal || 0;
  var Status = options.Status || 1; //Setting the estimate status to active by default   Status are:     Open, Finalized, Unused
  var CreatedDate = options.CreatedDate || new Date(); //Set estimateCreatedDate to current date;
  var estimateLineItemSet = options.estimateLineItemSet || new Array();
  
  Object.defineProperty(this, "ID", {
  get: function () { return ID; },
  set: function (newId) { ID = newId; },
  enumerable: true,
  });

  Object.defineProperty(this, "Subtotal", {
  get: function () { return Subtotal; },
  set: function (newSubtotal) { Subtotal = newSubtotal; },
  enumerable: true,
  });

  Object.defineProperty(this, "FinalTotal", {
  get: function () { return FinalTotal; },
  set: function (newFinalTotal) { FinalTotal = newFinalTotal; },
  enumerable: true,
  });

  Object.defineProperty(this, "Status", {
  get: function () { return Status; },
  set: function (newStatus) { Status = newStatus; },
  enumerable: true,
  });


  Object.defineProperty(this, "CreatedDate", {
  get: function () { return CreatedDate; },
  set: function (newCreatedDate) { CreatedDate = newCreatedDate; },
  enumerable: true,
  });


  Object.defineProperty(this, "estimateLineItemSet", {
    get: function () { return estimateLineItemSet; },
  set: function (newEstimateLineItemSet) { estimateLineItemSet = newEstimateLineItemSet; },
  enumerable: true,
  });
};


Estimate.prototype = {

   addEstimateLineItem: function (newestimateLineItem) {
        if (newestimateLineItem instanceof EstimateLineItem) {
      if(this.estimateLineItemSet != null)
        {
        this.estimateLineItemSet.push(newestimateLineItem);
        }
        }

    },
    
  removeEstimateLineItem: function (LineItemid) {
  
    var size = 0;
    var i = 0;  
    if(this.estimateLineItemSet != null){
    
      size = this.estimateLineItemSet.length;

            for (i=0;i<size;i++){
        if(this.estimateLineItemSet[i].id == LineItemid)
          {
            this.estimateLineItemSet.splice(i, 1);  // jobs = jobs.splice(i, 1);
            break;
          }
        }
      }
    },  
    
  calculateSubTotal: function () {
        
    var estimateLineItem;
    var size = 0;
    var i=0;
    this.Subtotal=0;
    var total=0;    
    
      if(this.estimateLineItemSet != null)
      {
       size = this.estimateLineItemSet.length;
      
      for (i=0;i<size;i++){
          estimateLineItem = this.estimateLineItemSet[i];
          total = estimateLineItem.calcTotal();
          this.Subtotal = this.Subtotal + total;
          } 
  
      }
      
//      this.Subtotal = 100; //this is just for testing that this method is actually being called and is returning something
      return this.Subtotal;     
  },

    calculateFinalTotal: function (Subtotal) {
      this.FinalTotal=0;
      this.FinalTotal = this.Subtotal * 1.15; //subtotal + taxes 
      
      this.FinalTotal=Math.round(this.FinalTotal*100)/100;
      
//      this.FinalTotal = 100;  //this is just for testing that this method is actually being called and is returning something
      return this.FinalTotal;
      
    },
    getNumOfEstimateLineItem: function() {
        return this.estimateLineItemSet.length;
    }
}




EstimateLineItem = function (options){
  options = options || {};  

  var id = options.id || 0;
  var name = options.name || "";
  var description = options.description || "";
  var quantity = options.quantity || 1;
  var cost = options.cost || 0;
  var media = options.media || null;

  Object.defineProperty(this, "Id", {
    get: function () { return id; },
    set: function (newId) { id = newId; },
    enumerable: true,
  });  

  Object.defineProperty(this, "Name", {
    get: function () {return name; },
    set: function (newName) {name = newName;},
    enumerable: true,
  });

  Object.defineProperty(this, "Description", {
    get: function () {return description; },
    set: function (newDesc) { description = newDesc;},
    enumerable: true,
  });

  Object.defineProperty(this, "Quantity", {
    get: function () {return quantity; },
    set: function (newQuan) {quantity = newQuan;},
    enumerable: true,
  });

  Object.defineProperty(this, "Cost", {
    get: function () {return cost; },
    set: function (newCost) {cost = newCost;},
    enumerable: true,
  });

  Object.defineProperty(this, "Media", {
    get: function () {return media; },
    set: function (newMedia) {media = newMedia;},
    enumerable: true,
  });	
	
};


EstimateLineItem.prototype = {
  calcTotal: function () {    
    return this.Quantity * this.Cost;
  },
  addMedia: function (media) {
    if (media instanceof Media) {
      this.Media = media;
    }
  },
  deleteMedia: function () {
    this.Media = false;
  },
  getMedia: function () {
    return this.Media;
  }
};


// Media class
Media = function () {
  
};


// Note class
Note = function (options) {
  options = options || {};

  var id = options.id || 0;
  var content = options.content || "";

  var d = new Date();
  var date = options.date || d.getDay() + '-' + d.getDate() + '-' + d.getFullYear();

  Object.defineProperty(this, "Id", {
    get: function () { return id; },
    set: function (newId) { id = newId; },
    enumerable: true,
  });  

  Object.defineProperty(this, "Content", {
    get: function () { return content; },
    set: function (newContent) { id = newContent; },
    enumerable: true,
  });  

  Object.defineProperty(this, "Date", {
    get: function () { return date; },
    set: function (newDate) { date = newDate; },
    enumerable: true,
  });  
};

exports.Customer = Customer;
exports.Job = Job;
exports.Estimate = Estimate;
exports.EstimateLineItem = EstimateLineItem;
exports.Media = Media;
exports.Note = Note;
