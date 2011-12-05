var vows = require('vows'),
    assert = require('assert');
    
var models = require('../classes/model.js');

var estimate = models.Estimate;
var EstimateLineItem = models.estimateLineItem;
    

var estimateOptions = {
  
  ID : 201,
  Status : 1, //Setting the estimate status to active
  CreatedDate : new Date(), //Set estimateCreatedDate to current date; 
  LineItemSet: [new estimateLineItem(estimateLineItemOptions1)],
  }

var d = new Date();
var date = d.getDay() + '-' + d.getDate() + '-' + d.getFullYear();
    
var estimateLineItemOptions1 = {
id : 100,
name: 'Test1',
description: 'Test Item 1',
quantity: 5,
cost: 5,
};


var estimateLineItemOptions2 = {
id: 101,
name: 'Test2',
description: 'Test Item 2',
quantity: 5,
cost: 5,
};


var estimateLineItemOptions3 = {
id: 102,
name: 'Test3',
description: 'Test Item 3',
quantity: 5,
cost: 5,
};

var estimateLineItemOptions4= {
id: 103,
name: 'Test4',
description: 'Test Item 4',
quantity: 5,
cost: 5,
}


var estimateLineItem1 = new estimateLineItem(estimateLineItemOptions1);
var estimateLineItem2 = new estimateLineItem(estimateLineItemOptions2);
var estimateLineItem3 = new estimateLineItem(estimateLineItemOptions3);
var estimateLineItem4 = new estimateLineItem(estimateLineItemOptions4);

// Create a Test Suite
vows.describe('Estimate').addBatch({
 'An Estimate': {
    'add one line item': {
     
	 topic: new Estimate(estimateOptions),
      'add 1 line items': function (topic) {
				topic.addEstimateLineItem(estimateLineItem2);
				topic.calculateSubTotal();
				topic.calculateFinalTotal();
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 50);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 57.5);
		},
    },

    'add 2 line items': {
      topic: new Estimate(estimateOptions),
      'add 2 line items': function (topic) {
				topic.addEstimateLineItem(estimateLineItem3);
				topic.addEstimateLineItem(estimateLineItem4);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 100);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 115);
		},
    },
	
    'drop 1 line item': {
      topic: new Estimate(estimateOptions),
      'drop 1 line items': function (topic) {
				topic.removeEstimateLineItem(estimateLineItem2);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 75);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 86.25);
		},
    },
    'drop 2 line items': {
      topic: new Estimate(estimateOptions),
      'drop 2 line items': function (topic) {
				topic.removeEstimateLineItem(estimateLineItem3);
				topic.removeEstimateLineItem(estimateLineItem4);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 25);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 28.75);
		},
    },

   },
}).export(module); // Run it