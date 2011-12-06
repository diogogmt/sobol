var vows = require('vows'),
    assert = require('assert');
    
var models = require('../classes/model.js');

var Estimate = models.Estimate;
var EstimateLineItem = models.EstimateLineItem;
    
var d = new Date();
var date = d.getDay() + '-' + d.getDate() + '-' + d.getFullYear();
    
var estimateLineItemOptions1 = {
	id : 1,
	total : 5,
};

var estimateLineItemOptions2 = {
	id : 2,
	total : 5,
};

var estimateLineItemOptions3 = {
	id : 3,
	total : 5,
};

var estimateLineItemOptions4 = {
	id : 4,
	total : 5,
};

var estimateLineItemOptions5 = {
	id : 5,
	total : 5,
};

var estimateLineItemOptions6 = {
	id : 6,
	total : 5,
};


var lineItem1 = new EstimateLineItem(estimateLineItemOptions3);
var lineItem2 = new EstimateLineItem(estimateLineItemOptions4);
var lineItem3 = new EstimateLineItem(estimateLineItemOptions5);
var lineItem4 = new EstimateLineItem(estimateLineItemOptions6);

var lineItem5 = new EstimateLineItem(estimateLineItemOptions2);


var estimateOptions = {
  
  ID : 202,
  Status : 1, //Setting the estimate status to active
  estimateLineItemSet : [
  	new EstimateLineItem(estimateLineItemOptions1), 
  	new EstimateLineItem(estimateLineItemOptions2), 
  	new EstimateLineItem(estimateLineItemOptions3), 
  	new EstimateLineItem(estimateLineItemOptions4)
	],
  CreatedDate : new Date(), //Set estimateCreatedDate to current date; 
};  
  
  
// Create a Test Suite
vows.describe('Estimate').addBatch({
 'An Estimate': {
		'with some data': {
			topic: new Estimate(estimateOptions),

			'id should be 201': function (topic) {
				assert.equal(topic.ID, 202);
			},
			'status should be 1': function (topic) {
				assert.equal(topic.Status, 1);
			},
			'should be 4 line items': function (topic) {
				assert.equal(topic.estimateLineItemSet.length, 4);
			},
			'Sub Total should be 20': function (topic) {
				topic.calculateSubTotal();
				assert.equal(topic.Subtotal, 20);
			},

			'Final Total should be 23': function (topic) {
				topic.calculateFinalTotal(topic.Subtotal);
				assert.equal(topic.FinalTotal, 23.00);
			},
		},

   'drop 2 line items from set of 4': {
	    topic: new Estimate(estimateOptions ),

     'Should be 2 line items left': function (topic) {
				topic.removeEstimateLineItem(lineItem2.id);
				topic.removeEstimateLineItem(lineItem1.id);
				
				assert.equal(topic.estimateLineItemSet.length, 2);
			},
			'Subtotal should be 10': function (topic) {
				topic.calculateSubTotal();
				assert.equal(topic.Subtotal, 10);		
			},
			'FinalTotal should be 11.50': function (topic) {
				topic.calculateFinalTotal(topic.Subtotal);
				assert.equal(topic.FinalTotal, 11.50);		
			},
		},
	
	
	  'drop 1 line item from set of 2': {
      topic: new Estimate(estimateOptions ),

      'Should be 1 line items': function (topic) {
				topic.removeEstimateLineItem(lineItem5.id);
				assert.equal(topic.estimateLineItemSet.length, 1);
			},		
			'Subtotal should be 5': function (topic) {
				topic.calculateSubTotal();
				assert.equal(topic.Subtotal, 5);
			},
			'Final total should be 5.75': function (topic) {
				topic.calculateFinalTotal(topic.Subtotal);
				assert.equal(topic.FinalTotal, 5.75);
			},
		},
	
		'add one line item to one line item': {
		 topic: new Estimate(estimateOptions),

      'There should now be 2 line items': function (topic) {
		  	topic.addEstimateLineItem(lineItem1);
				assert.equal(topic.estimateLineItemSet.length, 2);
		  },
			'Subtotal should be 10': function (topic) {
				topic.calculateSubTotal();
				assert.equal(topic.Subtotal, 10);		
			},
			'Final total should be 11.50': function (topic) {
				topic.calculateFinalTotal(topic.Subtotal);
				assert.equal(topic.FinalTotal, 11.50);
			},
		},
	
    'add 2 line items to set of 2': {
      topic: new Estimate(estimateOptions),
      
	    'should be 4 items': function (topic) {
				topic.addEstimateLineItem(lineItem2);
				topic.addEstimateLineItem(lineItem3);	  
				assert.equal(topic.estimateLineItemSet.length, 4); 
			},
			'Subtotal should be 20': function (topic) {
				topic.calculateSubTotal();
				assert.equal(topic.Subtotal, 20);		
			},
			'Final total should be 23': function (topic) {
				topic.calculateFinalTotal(topic.Subtotal);
				assert.equal(topic.FinalTotal, 23.00);		
			},
		},
   },
}).export(module); // Run it*/


