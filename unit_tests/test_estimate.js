var vows = require('vows'),
    assert = require('assert');
    
var models = require('../classes/model.js');

var Estimate = models.Estimate;
var EstimateLineItem = models.EstimateLineItem;
    
var d = new Date();
var date = d.getDay() + '-' + d.getDate() + '-' + d.getFullYear();
    
var estimateLineItemOptions1 = {
	id : 1,
	quantity:1,
	cost:5,
};

var estimateLineItemOptions2 = {
	id : 2,
	quantity:1,
	cost:5,
};

var estimateLineItemOptions3 = {
	id : 3,
	quantity:1,
	cost:5,
};

var estimateLineItemOptions4 = {
	id : 4,
	quantity:1,
	cost:5,
};

var estimateLineItemOptions5 = {
	id : 5,
	quantity:1,
	cost:5,
};

var estimateLineItemOptions6 = {
	id : 6,
	quantity:1,
	cost:5,
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

   'with four line items, deleting 2': {
	    topic: new Estimate(estimateOptions ),

     		'Should have 2 line items left after deleting 2': function (topic) {
				topic.removeEstimateLineItem(lineItem2.id);
				topic.removeEstimateLineItem(lineItem1.id);
				
				assert.equal(topic.estimateLineItemSet.length, 2);
			},
			'Should have Subtotal of 10': function (topic) {
				topic.calculateSubTotal();
				assert.equal(topic.Subtotal, 10);		
			},
			'Should have FinalTotal of 11.50': function (topic) {
				topic.calculateFinalTotal(topic.Subtotal);
				assert.equal(topic.FinalTotal, 11.50);		
			},
		},
	
	
	  'with two line items, deleting 1': {
      topic: new Estimate(estimateOptions ),

            'Should have one 1 line item left after deleting 1': function (topic) {
				topic.removeEstimateLineItem(lineItem5.id);
				assert.equal(topic.estimateLineItemSet.length, 1);
			},		
			'Should have Subtotal of 5': function (topic) {
				topic.calculateSubTotal();
				assert.equal(topic.Subtotal, 5);
			},
			'SHould have Final total of 5.75': function (topic) {
				topic.calculateFinalTotal(topic.Subtotal);
				assert.equal(topic.FinalTotal, 5.75);
			},
		},
	
	'with one line item, adding 1': {
		 topic: new Estimate(estimateOptions),

        'Should have 2 line items after adding 1': function (topic) {
		  	topic.addEstimateLineItem(lineItem1);
			assert.equal(topic.estimateLineItemSet.length, 2);
		  },
			'Should have Subtotal of 10': function (topic) {
				topic.calculateSubTotal();
				assert.equal(topic.Subtotal, 10);		
			},
			'Should have Final total of 11.50': function (topic) {
				topic.calculateFinalTotal(topic.Subtotal);
				assert.equal(topic.FinalTotal, 11.50);
			},
		},
	
    'with two line items, adding 2': {
      topic: new Estimate(estimateOptions),
      
	    'Should have 4 line items after adding 2': function (topic) {
				topic.addEstimateLineItem(lineItem2);
				topic.addEstimateLineItem(lineItem3);	  
				assert.equal(topic.estimateLineItemSet.length, 4); 
			},
			'Should have Subtotal of 20': function (topic) {
				topic.calculateSubTotal();
				assert.equal(topic.Subtotal, 20);		
			},
			'Should have Final total of 23': function (topic) {
				topic.calculateFinalTotal(topic.Subtotal);
				assert.equal(topic.FinalTotal, 23.00);		
			},
		},
   },
}).export(module); // Run it*/


