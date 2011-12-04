Estimate = function (options) {
options = options || {};

var ID = options.ID || 0; //some Mongo DB method for assigning ID should go here
//var Subtotal = options.Subtotal || 0;
//var FinalTotal = options.FinalTotal || 0;
var Status = options.Status || 1; //Setting the estimate status to active by default   Status are:     Open, Finalized, Unused
var estimateLineItemSet = options.estimateLineItemSet || new Array();
var CreatedDate = options.CreatedDate || new Date(); //Set estimateCreatedDate to current date;

Object.defineProperty(this, "ID", {
get: function () { return ID; },
set: function (newId) { ID = newId; },
enumerable: true,
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
/*
Object.defineProperty(this, "EstimateLineItemSet", {
        get: function () { return EstimateLineItemSet; },
        set: function (newLineItemSet) { EstimateLineItemSet = newLineItemSet; },
enumerable: true,
});
*/

  Object.defineProperty(this, "EstimateLineItemSet", {
    get: function () { return EstimateLineItemSet; },
    enumerable: true,
  });



Object.defineProperty(this, "CreatedDate", {
get: function () { return CreatedDate; },
set: function (newCreatedDate) { Status = newCreatedDate; },
enumerable: true,
});

}
////-------------------------------------------
Estimate.prototype = {

    addEstimateLineItem: function (newestimateLineItem) {
        if (newestimateLineItem instanceof estimateLineItem) {
            this.estimateLineItemSet.push(newestimateLineItem);
		    }
	},

    removeEstimateLineItem: function (LineItemid) {
  
		var size = estimateLineItemSet.length;
		
  		for (i=0;i<=size;i++){
				if(estimates[i].id == LineItemid)
					{
						estimates.splice (i);
					}
			}
    },	

    calculateSubTotal: function () {
        
		var estimateLineItem;
		var size = estimateLineItemSet.length;
		var i=0;
		
		for (i=0;i<=size;i++){
			estimateLineItem = estimateLineItemSet[i];
			var Subtotal = Subtotal + estimateLineItem.total;
			}
		 return this.Subtotal;
    },
	
    calculateFinalTotal: function (Subtotal) {
        
			var Subtotal = calculateSubTotal();
			var FinalTotal = Subtotal * 1.15; //subtotal + taxes 
			return this.FinalTotal;
    },
}

exports.Estimate = Estimate;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
estimateLineItem = function(options) {
options = options || {};

var id = options.id || 0;
var name = options.name || "";
var description = options.description || "";
var quantity = options.quantity || 0;
var cost = options.cost || 0;
var total = options.Total || 0;
var media = options.media || null;

Object.defineProperty(this, "Id", {
value: id,
writable: false,
});

Object.defineProperty(this, "name", {
get: function () {return name; },
set: function (newName) {name = newName;},
enumerable: true,
});

Object.defineProperty(this, "description", {
get: function () {return description; },
set: function (newDesc) { description = newDesc;},
enumerable: true,
});

Object.defineProperty(this, "quantity", {
get: function () {return description; },
set: function (newQuan) {quantity = newQuan;},
enumerable: true,
});

Object.defineProperty(this, "cost", {
get: function () {return cost; },
set: function (newCost) {cost = newCost;},
enumerable: true,
});

Object.defineProperty(this, "total", {
get: function () {return total; },
set: function (newTotal) {total = newTotal;},
enumerbale: true,
});

Object.defineProperty(this, "media", {
get: function () {return media; },
set: function (newMedia) {media = newMedia;},
enumerable: true,
});
};

//////////////////////////////

estimateLineItem.prototype = {


    calculateTotal: function () {
        
			
			var Total = quantity * cost; 
			return this.Total;
    },
}





exports.estimateLineItem = estimateLineItem; 