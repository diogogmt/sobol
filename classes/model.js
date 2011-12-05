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
					total = estimateLineItem.total;
					this.Subtotal = this.Subtotal + total;
					}	
	
			}
			
//			this.Subtotal = 100; //this is just for testing that this method is actually being called and is returning something
			return this.Subtotal;			
	},

    calculateFinalTotal: function (Subtotal) {
			this.FinalTotal=0;
			Subtotal = this.calculateSubTotal();
			this.FinalTotal = this.Subtotal * 1.15; //subtotal + taxes 
			
			this.FinalTotal=Math.round(this.FinalTotal*100)/100;
			
//			this.FinalTotal = 100;  //this is just for testing that this method is actually being called and is returning something
			return this.FinalTotal;
			
    },
    getNumOfEstimateLineItem: function() {
        return this.estimateLineItemSet.length;
    }
}

exports.Estimate = Estimate;
////////////////
EstimateLineItem = function (options){
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