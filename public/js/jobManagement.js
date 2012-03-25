
var JobManagement = function (opt) {
  console.log("JobManagement constructor");
  console.log(opt);
  this.customerId = opt.customerId || 0;
  this.jobId = opt.jobId || 0;
  this.dates = (opt.dates && opt.dates.split(",")) || null;

  this.estimateDataTable = null;

  console.log("this.customerId: " + this.customerId);
  console.log("this.jobId: " + this.jobId);
  // Templates
  this.addEstimateOverlayTmpl = $("#addEstimateOverlayTmpl");
  this.estimateDataTableOverlayTmpl = $("#estimateDataTableOverlayTmpl");
  this.editJobmTmpl = $("#editJobTmpl");

  // Elements
  this.addEstimateOverlay = $("#addEstimateOverlay");
  this.estimateTable = $("#estimateTable");
  this.editJobForm = $("#editJobForm");
  this.addtEstimateForm = $("#addEstimateForm");
  // Buttons
  this.addEstimateBtn = $("#addEstimateBtn");
  this.saveEstimateBtn = $("#saveEstimateBtn");
  this.editJobBtn = $("#editJobBtn");
  console.log("$('#editJobBtn')" + $("#editJobBtn"));

  this.addEstimateOverlayObj;

  this.initOverlays();
  this.loadTemplates();
  this.loadDatePicker();
  this.loadEstimateDataTable();
  this.createHandlers();
};



JobManagement.prototype.loadTemplates = function() {
  console.log("loadTemplates");
  console.log(this);
  console.log(this.editJobmTmpl);
  this.addEstimateOverlayTmpl.tmpl({}).appendTo(this.addEstimateOverlay);
  this.estimateDataTableOverlayTmpl.tmpl({}).appendTo(this.estimateTable);
  this.editJobmTmpl.tmpl({}).appendTo(this.editJobForm);
};

JobManagement.prototype.validateAddEstimateFields = function() {
  console.log("validateAddEstimateFields");
  // do validation
  return true;
};

JobManagement.prototype.getAddEstimateFields = function() {
  console.log("validateAddEstimateFields");
  var that = this;
  console.log("name");
  console.log($("#estimateNameTxt").val());
  return {
    'estimate': {
      "name": $("#estimateNameTxt").val(),
    }
  };
};

JobManagement.prototype.createHandlers = function() {
  console.log("createHandlers");
  this.createAddEstimateHandler();
  this.createCancelEstimateHandler();
  this.createSaveEstimateHandler();
  this.createEditJobHandler();
};


JobManagement.prototype.createAddEstimateHandler = function() {
  console.log("createAddEstimateHandler");
  var that = this;
  $(this.addEstimateBtn).live("click", function (e) {
    console.log("addEstimateBtn click");
    that.addEstimateOverlayObj.load();
  });
};

JobManagement.prototype.createCancelEstimateHandler = function() {
  console.log("createCancelEstimateHandler");

};

JobManagement.prototype.createSaveEstimateHandler = function() {
  console.log("createSaveEstimateHandler");
  var that = this;
  $(this.saveEstimateBtn).live("click", function (e) {
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

JobManagement.prototype.loadEstimateDataTable = function() {
  console.log("loadEstimateDataTable");
};

JobManagement.prototype.initOverlays = function() {
  console.log("initOverlays");
  var that = this;

  $(that.addEstimateOverlay).overlay({
    // custom top position
    top: 260,
    // some mask tweaks suitable for facebox-looking dialogs
    mask: {
      // you might also consider a "transparent" color for the mask
      color: '#fff',
      // load mask a little faster
      loadSpeed: 200
    },
    // disable this for modal dialog-type of overlays
    closeOnClick: false,
  });
  this.addEstimateOverlayObj = $(that.addEstimateOverlay).overlay({});

  $(that.addEstimateOverlay).overlay({
    // custom top position
    top: 260,
    // some mask tweaks suitable for facebox-looking dialogs
    mask: {
      // you might also consider a "transparent" color for the mask
      color: '#fff',
      // load mask a little faster
      loadSpeed: 200
    },
    // disable this for modal dialog-type of overlays
    closeOnClick: false,
  });
  this.addEstimateOverlayObj = $(that.addEstimateOverlay).overlay({});

};

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


JobManagement.prototype.createEditJobHandler = function() {
  console.log("createEditJobHandler");
  var that = this;
  console.log("this.editJobBtn: " + this.editJobBtn);
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
          // that.loadEstimateDataTable();
          // that.addEstimateOverlayObj.close();
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

JobManagement.prototype.validateEditJobFields = function() {
  console.log("validateUpdateJobFields");
  // do validation
  return true;
};

JobManagement.prototype.getEditJobFields = function() {
  console.log("getUpdateJobFields");
  var that = this;
  console.log("name");
  console.log($("#estimateNameTxt").val());
  return {
    'job': {
      "name": $("#jobName").val(),
      "description": $("#jobDesc").val(),
      "status": $("#jobStatus").val(),
      "scheduledDates": $('#datepicker').multiDatesPicker('getDates'),
    }
  };
};


JobManagement.prototype.loadDatePicker = function() {
  console.log("loadDatePicker");
  console.log("this.dates: ", this.dates);
  $("#datepicker").multiDatesPicker();
  this.dates && $("#datepicker").multiDatesPicker('addDates', this.dates);

}