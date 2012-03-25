
var JobManagement = function (opt) {
  console.log("JobManagement constructor");
  console.log(opt);
  this.customerId = opt.customerId || 0;
  this.jobId = opt.jobId || 0;
  this.dates = (opt.dates && opt.dates.split(",")) || null;

  this.estimateDataTable = null;

  this.addEstimateOverlayObj;

  this.initOverlays();
  this.loadDatePicker();
  this.loadEstimateDataTable();
  this.createHandlers();
};


// Initialize overlay object
JobManagement.prototype.initOverlays = function() {
  console.log("initOverlays");
  var that = this;

  $(that.addEstimateOverlay).overlay({
    top: 260,
    mask: {
      color: '#fff',
      loadSpeed: 200
    },
    closeOnClick: false,
  });
  this.addEstimateOverlayObj = $("#addEstimateOverlay").overlay({});

  $(that.addEstimateOverlay).overlay({
    top: 260,
    mask: {
      color: '#fff',
      loadSpeed: 200
    },
    closeOnClick: false,
  });
  this.addEstimateOverlayObj = $("#addEstimateOverlay").overlay({});

};

// Create Event Handlers
JobManagement.prototype.createHandlers = function() {
  console.log("createHandlers");
  this.createEstimateOverlayHandler();
  this.cancelEstimateHandler();
  this.saveEstimateHandler();
  this.editJobHandler();
};


// Edit job  button handler
JobManagement.prototype.editJobHandler = function() {
  console.log("editJobHandler");
  var that = this;
  console.log("$(editoBtn)" + $("#editJobBtn"));
  $("#editJobBtn").click(function (e) {
    console.log("EditJobBtn click");
    if (that.validateEditJobFields()) {
      console.log("form is valid");
      console.log("fields: " + that.getEditJobFields());
      $.ajax({
        url: "/job/" + that.jobId + "/edit",
        type: "POST",
        data: that.getEditJobFields(),
        success: function (data) {
          console.log("success");
          console.log(data);
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
  }); // END saveEstimateBtn click
};

// Estimate overlay button handler
JobManagement.prototype.createEstimateOverlayHandler = function() {
  console.log("createEstimateOverlayHandler");
  var that = this;
  $("#createEstimateOverlayBtn").click(function (e) {
    console.log("createEstimateBtn click");
    that.addEstimateOverlayObj.load();
  });
};

// Cancel estimate button handler
JobManagement.prototype.cancelEstimateHandler = function() {
  console.log("cancelEstimateHandler");
  var that = this;
  $("#cancelEstimateBtn").click(function (e) {
    console.log("cancel estimate button");
    that.addEstimateOverlayObj.close();
  });
};

// Save estimate button handler
JobManagement.prototype.saveEstimateHandler = function() {
  console.log("saveEstimateHandler");
  var that = this;
  $("#saveEstimateBtn").click(function (e) {
    console.log("saveEstimateBtn click");
    if (that.validateAddEstimateFields()) {
      console.log("form is valid");
      console.log("fields: " + that.getAddEstimateFields());
      $.ajax({
        url: "/job/" + that.jobId + "/estimate/add",
        type: "POST",
        data: that.getAddEstimateFields(),
        success: function (data) {
          console.log("success");
          console.log(data);
          $("#estimateName").val("");
          that.loadEstimateDataTable();
          that.addEstimateOverlayObj.close();
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
  }); // END saveEstimateBtn click
};

// Validate Add Estimate Fields
JobManagement.prototype.validateAddEstimateFields = function() {
  console.log("validateAddEstimateFields");
  // do validation
  return true;
};

// Get Estimate Fields
JobManagement.prototype.getAddEstimateFields = function() {
  console.log("validateAddEstimateFields");
  var that = this;
  console.log("name");
  return {
    'estimate': {
      "name": $("#estimateName").val(),
    }
  };
};

// Validate Edit Jobs Fields
JobManagement.prototype.validateEditJobFields = function() {
  console.log("validateUpdateJobFields");
  // do validation
  return true;
};

// Get Edit Job Fields
JobManagement.prototype.getEditJobFields = function() {
  console.log("getUpdateJobFields");
  var that = this;
  console.log("name");
  return {
    'job': {
      "name": $("#jobName").val(),
      "description": $("#jobDesc").val(),
      "status": $("#jobStatus").val(),
      "scheduledDates": $('#datepicker').multiDatesPicker('getDates'),
    }
  };
};

// Load estimates datatable
JobManagement.prototype.loadEstimateDataTable = function() {
  console.log("loadEstimateDataTabel");
  var that = this;
  this.estimateDataTable = $("#estimateTable").dataTable({
    "bProcessing": true,
    "bDestroy": true,
    "sAjaxSource": "/datatable/job/" + that.jobId + "/estimates",
    "aoColumnDefs": [
      { "bVisible" : false, "aTargets" : [0] }
    ],
    "aaSorting": [[3, "desc"]]
  });

  $("#estimateTable tbody tr").live("click", function() {
      var row = that.estimateDataTable.fnGetData(this);
      console.log("row: " + row);
      var estimateID = row[0];
      window.location = "/job/" + that.jobId + "/estimate/" + estimateID;
    });
};

// Load date picker
JobManagement.prototype.loadDatePicker = function() {
  console.log("loadDatePicker");
  console.log("this.dates: ", this.dates);
  $("#datepicker").multiDatesPicker();
  this.dates && $("#datepicker").multiDatesPicker('addDates', this.dates);

}