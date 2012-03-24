
var EstimateManagement = function (opt) {
  console.log("EstimateManagement constructor");
  console.log(opt);
  (opt && opt.jobId) ? this.jobId = opt.jobId : null;
  (opt && opt.estimateId) ? this.estimateId = opt.estimateId : null;

  console.log("this.jobId: " + this.jobId);
  console.log("this.estimateId: " + this.estimateId);
  // Templates
  this.addLineItemOverlayTmpl = $("#addLineItemOverlayTmpl");
  this.lineItemDataTableOverlayTmpl = $("#lineItemDataTableOverlayTmpl");
  this.editEstimatemTmpl = $("#editEstimateTmpl");

  // Elements
  this.addLineItemOverlay = $("#addLineItemOverlay");
  this.lineItemTable = $("#lineItemTable");
  this.editEstimateForm = $("#editEstimateForm");
  this.addtLineItemForm = $("#addLineItemForm");
  // Buttons
  this.addLineItemBtn = $("#addLineItemBtn");
  this.saveLineItemBtn = $("#saveLineItemBtn");

  this.addLineItemOverlayObj;

  this.initOverlays();
  this.loadTemplates();
  this.loadLineItemDataTable();
  this.createHandlers();
};



EstimateManagement.prototype.loadTemplates = function() {
  console.log("loadTemplates");
  console.log(this);
  console.log(this.editEstimatemTmpl);
  this.addLineItemOverlayTmpl.tmpl({}).appendTo(this.addLineItemOverlay);
  this.lineItemDataTableOverlayTmpl.tmpl({}).appendTo(this.lineItemTable);
  this.editEstimatemTmpl.tmpl({}).appendTo(this.editEstimateForm);
};

EstimateManagement.prototype.validateAddLineItemFields = function() {
  console.log("validateAddLineItemFields");
  // do validation
  return true;
};

EstimateManagement.prototype.getAddLineItemFields = function() {
  console.log("validateAddLineItemFields");
  var that = this;
  console.log("name");
  console.log($("#lineItemNameTxt").val());
  return {
    lineItem: {
      name: $("#lineItemNameTxt").val(),
      description: $("#lineItemDescriptionTxt").val(),
      quantity: $("#lineItemQuantityTxt").val(),
      cost: $("#lineItemCostTxt").val(),
    },
    jobID: $("#jobID").val(),
    estimateID: $("#estimateID").val(),
  };
};

EstimateManagement.prototype.createHandlers = function() {
  console.log("createHandlers");
  this.createAddLineItemHandler();
  this.createCancelLineItemHandler();
  this.createSaveLinteItemHandler();
};


EstimateManagement.prototype.createAddLineItemHandler = function() {
  console.log("createAddLineItemHandler");
  var that = this;
  $(this.addLineItemBtn).live("click", function (e) {
    console.log("addLineItemBtn click");
    that.addLineItemOverlayObj.load();
  });
};

EstimateManagement.prototype.createCancelLineItemHandler = function() {
  console.log("createCancelLineItemHandler");

};

EstimateManagement.prototype.createSaveLinteItemHandler = function() {
  console.log("createSaveLinteItemHandler");
  var that = this;
  $(this.saveLineItemBtn).live("click", function (e) {
    console.log("saveLineItemBtn click");
    if (that.validateAddLineItemFields()) {
      console.log("form is valid");
      $.ajax({
        url: "/lineItem/add",
        type: "POST",
        data: that.getAddLineItemFields(),
        success: function (data) {
          console.log("success");
          console.log(data);
          that.loadLineItemDataTable();
          that.addLineItemOverlayObj.close();
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
  }); // END saveLineItemBtn click
};

EstimateManagement.prototype.loadLineItemDataTable = function() {
  console.log("loadLineItemDataTable");
};

EstimateManagement.prototype.initOverlays = function() {
  console.log("initOverlays");
  var that = this;

  $(that.addLineItemOverlay).overlay({
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
  this.addLineItemOverlayObj = $(that.addLineItemOverlay).overlay({});

  $(that.addLineItemOverlay).overlay({
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
  this.addLineItemOverlayObj = $(that.addLineItemOverlay).overlay({});

};

EstimateManagement.prototype.loadLineItemDataTable = function() {
  console.log("loadLineItemDataTabel");
  var that = this;
  $("#lineItemTable").dataTable( {
    "bProcessing": true,
    "bDestroy": true,
    "sAjaxSource": "/datatable/job/" + that.jobId + "/estimate/" +
       that.estimateId + "/lineItems",
    "aoColumnDefs": [
      { "bVisible" : false, "aTargets" : [0] }
     ]
   });
};