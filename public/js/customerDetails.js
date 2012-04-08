var CustomerDetails = function (opt) {
  this.custId = opt ? opt.custId : 0;

  this.loadJobs();
  this.loadNotes();
  this.initOverlay();
  this.createHandlers();
};

CustomerDetails.prototype.createHandlers = function() {
  // Notes datatable click handler
  var that = this;

  $("#noteTable tbody tr").live("click", function() {
    var data = $("#noteTable").dataTable().fnGetData(this);
    var noteID = data[0];
    var noteText = data[1];
    var LastModifiedDate = data[2];
    that.loadCreateUpdateNoteTemplate({
      "mode": "Update",
      "id": data[0],
      "content": data[1],
    })
  });
  $('#deleteNote').click(function() {
    var ID = $('#NoteID').val();
    window.location = "/customer/" + this.custId + "/note/delete/" + ID;
  });


  $("#viewJobs").click(function() {
    $("#notesList").toggle();
    $("#jobList").toggle();
  });

  // Jobs datatable row click handler
  $("#jobTable tbody tr").live("click", function() {
      var data = $("#jobTable").dataTable().fnGetData(this);
      var jobID = data[0];
      window.location = "/job/" + jobID;
  });

  $("#viewNotes").click(function() {
    $("#notesList").toggle();
    $("#jobList").toggle();
  });

  if('#{customer.status}' == "Inactive") {
    $("#addJob").toggle();
  }

  $("#createJobBtn").click(function (e) {
    $("#createJobOverlay").overlay().load();
    return false;
  });

  $("#saveJobBtn").click(function (e) {
    if (that.validateJob()) {
      console.log("job is valid");
      console.log("getJobData: ", that.getJobData());
      $.ajax({
        url: "/customer/" + that.custId + "/jobs/add",
        type: "POST",
        data: that.getJobData(),
        success: function (data) {
          console.log("success");
          console.log(data);
          $("#createJobForm").clearForm();
          that.loadJobs();
          $("#createJobOverlay").overlay().close();
        },
        error: function () {
          console.log("error");
        },
        complete: function () {
          console.log("complete");
        }
      }); // END ajax
    }
    return false;
  });

  $("#cancelJobBtn").click(function (e) {
    $("#createJobOverlay").overlay().close();
    return false;
  });

  $("#createNoteBtn").click(function (e) {
    that.loadCreateUpdateNoteTemplate();
    $("#createUpdateNoteOverlay").overlay().load();
    return false;
  });

  $("#saveNoteBtn").live("click", function (e) {
    if (that.validateNote()) {
      console.log("note is valid");
      console.log("getNoteData: ", that.getNoteData());
      $.ajax({
        url: "/customer/" + that.custId + "/notes/add",
        type: "POST",
        data: that.getNoteData(),
        success: function (data) {
          console.log("success");
          console.log(data);
          $("#createUpdateNoteForm").clearForm();
          that.loadNotes();
          $("#createUpdateNoteOverlay").overlay().close();
        },
        error: function () {
          console.log("error");
        },
        complete: function () {
          console.log("complete");
        }
      }); // END ajax
    }
    return false;
  });

  $("#cancelNoteBtn").live("click", function (e) {
    $("#createUpdateNoteOverlay").overlay().close();
    return false;
  });
};

CustomerDetails.prototype.initOverlay = function() {
  $("#createJobOverlay").overlay({
    mask: {
      color: '#fff',
      loadSpeed: 200,
      opacity: 0.8,
    },
    closeOnClick: false,
  });

  $("#createUpdateNoteOverlay").overlay({
    mask: {
      color: '#fff',
      loadSpeed: 200,
      opacity: 0.8,
    },
    closeOnClick: false,
  });
};

CustomerDetails.prototype.loadCreateUpdateNoteTemplate = function(opt) {
  var note = {
    "title": (opt && opt.mode) || "Create",
    "id": (opt && opt.id )|| "",
    "content": (opt && opt.content) || "",
  };
  $("#createUpdateNoteOverlay").empty();
  $("#createUpdateNoteOverlayTmpl").tmpl(note).appendTo($("#createUpdateNoteOverlay"));
};

CustomerDetails.prototype.loadJobs = function() {
  $("#jobTable").dataTable( {
    "bProcessing": true,
    "bDestroy": true,
    "sAjaxSource": "/datatable/customer/" + this.custId + "/jobs",
    "aoColumnDefs": [
      { "bVisible" : false, "aTargets" : [0] }
    ],
    "aaSorting": [[4, "desc"]]
  });
};

CustomerDetails.prototype.loadNotes = function() {
  $("#noteTable").dataTable({
    "bProcessing": true,
    "bDestroy": true,
    "sAjaxSource": "/datatable/customer/" + this.custId + "/notes",
    "aoColumnDefs": [
      { "bVisible" : false, "aTargets" : [0] }
    ],
    "aaSorting": [[4, "desc"]]
  });
};

CustomerDetails.prototype.validateJob = function() {
  console.log("validateJob");
  return true;
}

CustomerDetails.prototype.getJobData = function() {
  console.log("getJobData");
  return {
    "job": {
      "name": $("#jobName").val(),
      "description": $("#jobDesc").val(),
    },
  };
}

CustomerDetails.prototype.validateNote = function() {
  console.log("validateNote");
  return true;
}

CustomerDetails.prototype.getNoteData = function() {
  console.log("getNoteData");
  return {
    "note": {
      "noteText": $("#noteContent").val(),
    },
  };
}