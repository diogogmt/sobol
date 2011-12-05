Estimate = function (options) {
options = options || {};

var ID = options.ID || 0; //some Mongo DB method for assigning ID should go here
var Subtotal = options.Subtotal || 0;
var FinalTotal = options.FinalTotal || 0;
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


  Object.defineProperty(this, "EstimateLineItemSet", {
    get: function () { return estimateLineItemSet; },
	set: function (newEstimateLineItemSet) { estimateLineItemSet = newEstimateLineItemSet; },
	enumerable: true,
  });

Object.defineProperty(this, "CreatedDate", {
get: function () { return CreatedDate; },
set: function (newCreatedDate) { CreatedDate = newCreatedDate; },
enumerable: true,
});

}
////-------------------------------------------
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
			
		if(this.estimateLineItemSet != null){
		
			size = this.estimateLineItemSet.length;

			  		for (i=0;i<=size;i++){
				if(this.estimates[i].id == LineItemid)
					{
						this.estimates.splice (i);
					}
				}
			}
    },	

    calculateSubTotal: function () {
        
		var estimateLineItem;
		var size = 0;
		var i=0;
		this.Subtotal=0;		
			if(this.estimateLineItemSet != null)
			{
			 size = this.estimateLineItemSet.length;
			
			for (i=0;i<=size;i++){
					estimateLineItem = this.estimateLineItemSet[i];
					var total = estimateLineItem.total();
					this.Subtotal = Subtotal + total;
					}	
	
			}
			
//			this.Subtotal = 100; //this is just for testing that this method is actually being called and is returning something
			return this.Subtotal;			
	},
	
    calculateFinalTotal: function (Subtotal) {
			this.FinalTotal=0;
			Subtotal = this.calculateSubTotal();
			this.FinalTotal = this.Subtotal * 1.15; //subtotal + taxes 
			
//			this.FinalTotal = 100;  //this is just for testing that this method is actually being called and is returning something
			return this.FinalTotal;
			
    },

	
}

exports.Estimate = Estimate;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
EstimateLineItem = function (options) {
  options = options || {};

  var id = options.id || 0;
  var total = options.total || 0;

    Object.defineProperty(this, "id", {
    get: function () { return id; },
    set: function (newid) { id = newid; },
    enumerable: true,
  });
    
  Object.defineProperty(this, "total", {
    get: function () { return total; },
    set: function (newtotal) { total = newtotal; },
    enumerable: true,
  });

};

exports.EstimateLineItem = EstimateLineItem;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// old copy paste of Umar's code
/*
EstimateLineItem = function (options) {
options = options || {};

var id = options.id || 0;
var name = options.name || "";
var description = options.description || "";
var quantity = options.quantity || 0;
var cost = options.cost || 0;
var total = options.total || 0;
var media = options.media || null;

Object.defineProperty(this, "Id", {
get: function () { return Id; },
set: function (newId) { Id = newId; },
enumerable: true,
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
get: function () {return quantity; },
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
enumerable: true,
});

Object.defineProperty(this, "media", {
get: function () {return media; },
set: function (newMedia) {media = newMedia;},
enumerable: true,
});
};


EstimateLineItem.prototype = {
  
      calculateTotal: function () {
        
			
			this.total = this.quantity * this.cost; 
			return this.total;
    },
  

}

exports.EstimateLineItem = EstimateLineItem;
*/


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////