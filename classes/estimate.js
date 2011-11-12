    //Creating an empty estimate class
    function estimate() {
    var estimateID = 0; //some Mongo DB method for assigning ID should go here
    var estimateSubtotal = 0;
    var estimateFinalTotal = 0;
    var estimateStatus = 1; //Setting the estimate status to active by default
    var estimateLineItem  = new Array();
    var estimateCreatedDate  = new Date(); //Set estimateCreatedDate to current date;
     
    }
     
    this.getEstimateID = function (){
    return this.estimateID;
    }
     
    this.getEstimateSubtotal = function(){
    return this.estimateSubtotal;
    }
     
     
    this.getEstimateFinaltotal = function(){
    return this.estimateFinalTotal;
    }
     
    this.getEstimateStatus = function(){
    return this.estimateStatus;
    }
     
     
    this.getEstimateLineItem = function(){
    return this.estimateLineItem;
    }
     
    this.getEstimateCreatedDate = function(){
    return this.estimateCreatedDate
    }
     
     
    this.addEstimateLineItem = function(){
    EstimateLineItem.setEstimateLineItem(estimateID);
    }
     
    this.setEstimateStatus = function(status){
            if(status >= 1 && status <= 3){
               estimateLineItem = status
              }
    }
