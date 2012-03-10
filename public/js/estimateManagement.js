
var EstimateManagement = function (opt) {
	console.log("EstimateManagement constructor");
	// Templates
	this.addLineItemOverlayTmpl = $("#addLineItemOverlayTmpl");
	this.lineItemDataTableOverlayTmpl = $("#lineItemDataTableOverlayTmpl");
	this.editEstimatemTmpl = $("#editEstimateTmpl");

	// Elements
	this.addLineItemOverlay = $("#addLineItemOverlay");
	this.lineItemTable = $("#lineItemTable");
	this.editEstimateForm = $("#editEstimateForm");

	this.loadTemplates();
};

EstimateManagement.prototype.loadTemplates = function() {
	console.log("loadTemplates");
	console.log(this);
	console.log(this.editEstimatemTmpl);
	this.addLineItemOverlayTmpl.tmpl({}).appendTo(this.addLineItemOverlay);
	this.lineItemDataTableOverlayTmpl.tmpl({}).appendTo(this.lineItemTable);
	this.editEstimatemTmpl.tmpl({}).appendTo(this.editEstimateForm);
};

EstimateManagement.prototype.createAddLineItemHandler = function() {
	console.log("createAddLineItemHandler");
};

EstimateManagement.prototype.createCancelLineItemHandler = function() {
	console.log("createCancelLineItemHandler");
};

EstimateManagement.prototype.createSaveLinteItemHandler = function() {
	console.log("createSaveLinteItemHandler");
};

EstimateManagement.prototype.loadLineItemDataTable = function() {
	console.log("loadLineItemDataTable");
};
