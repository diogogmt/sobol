Estimate = function (options) {
options = options || {};

var ID = options.ID || 0; //some Mongo DB method for assigning ID should go here
var Subtotal = options.Subtotal || 0;
var FinalTotal = options.FinalTotal || 0;
var Status = options.Status || 1; //Setting the estimate status to active by default   Status are:     Open, Finalized, Unused
var LineItemSet = options.LineItem || new Array();
var CreatedDate = options.CreatedDate || new Date(); //Set estimateCreatedDate to current date;

Object.defineProperty(this, "ID", {
value: ID,
writable: false,
enumerable: true,
get: function () { return ID; },

});

Object.defineProperty(this, "Subtotal", {
get: function () { return Subtotal; },
enumerable: true,
});

Object.defineProperty(this, "FinalTotal", {
get: function () { return FinalTotal; },
enumerable: true,
});

Object.defineProperty(this, "Status", {
get: function () { return Status; },
set: function (newStatus) { Status = newStatus; },
enumerable: true,
});

Object.defineProperty(this, "LineItemSet", {
        get: function () { return LineItemSet; },
        set: function (newLineItemSet) { LineItemSet = newLineItemSet; },
enumerable: true,
});

Object.defineProperty(this, "CreatedDate", {
get: function () { return CreatedDate; },
set: function (newCreatedDate) { Status = newCreatedDate; },
enumerable: true,
});
}


Estimate.prototype = {

addJob: function (job) {
    addEstimateLineItem: function (EstimateLineItem) {
        if (EstimateLineItem instanceof EstimateLineItem) {
            this.LineItemSet.push(EstimateLineItem);
        }
},

    addEstimateLineItem: function (options) {
        var estimateLineItem = new EstimateLineItem(options);
        this.LineItemSet.push(estimate);
    },

    removeEstimateLineItem: function (estimateLineItem) {
   		var size = LineItemSet.length;
		
  		for (i=0;i<=size;i++){
				if(LineItemSet[i] == estimateLineItem)
					{
						LineItemSet.splice (i);
					}
			}
    },	
	
    calculateSubTotal: function (LineItemSet) {
        
		var estimateLineItem;
		var size = LineItemSet.length;
		var i=0;
		
		for (i=0;i<=size;i++){
			estimateLineItem = LineItemSet[i];
			Subtotal = Subtotal + estimateLineItem.total;
			}
		 return this.Subtotal;
    },


    calculateFinalTotal: function (Subtotal) {
        
			FinalTotal = Subtotal * 1.15; //subtotal + taxes 
			}
		 return this.FinalTotal;
    },

}

exports.Estimate = Estimate;