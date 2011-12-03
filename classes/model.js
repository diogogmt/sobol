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
    if (job instanceof Job) {
      this.Jobs.push(job);
    }
  },
  deleteJob: function (jobId) {
    var i,
        jobs = this.Jobs,
        jobsLength = this.totalJobs()
    ;
    console.log("deleteJob");
    console.log("jboId: " + jobId);
    for (i = 0; i < jobsLength; i++) {
      console.log("i: " + i);
      console.log("jobs[" + i + "].Id: " + jobs[i].Id);
      if (jobs[i].Id == jobId) {
        console.log("jobs[" + i + "].Id: " + jobs[i].Id + " == " + jobId);
        console.log("jobsLength: " + jobsLength);
        jobs = jobs.splice(i, 1);
        console.log("this.totalJobs(): " + this.totalJobs());
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
    console.log("deleteNote");
    console.log("noteId: " + noteId);
    for (i = 0; i < notesLength; i++) {
      console.log("i: " + i);
      console.log("notes[" + i + "].Id: " + notes[i].Id);
      if (notes[i].Id == noteId) {
        console.log("notes[" + i + "].Id: " + notes[i].Id + " == " + noteId);
        console.log("notesLength: " + notesLength);
        notes = notes.splice(i, 1);
        console.log("this.totalNotes(): " + this.totalNotes());
        break;
      }
    }
  },
  totalNotes: function () {
    return this.Notes.length;
  }

}

exports.Customer = Customer;


// Job
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


exports.Note = Note;

// Job
Job = function (options) {

};

exports.Job = Job;



