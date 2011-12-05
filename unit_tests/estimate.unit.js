var vows = require('vows'),
    assert = require('assert');
    
var models = require('../classes/model.js');

var Estimate = models.Estimate;
var estimateLineItem = models.estimateLineItem;
    
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
};

var estimateLineItem1 = new estimateLineItem(estimateLineItemOptions1);
var estimateLineItem2 = new estimateLineItem(estimateLineItemOptions2);
var estimateLineItem3 = new estimateLineItem(estimateLineItemOptions3);
var estimateLineItem4 = new estimateLineItem(estimateLineItemOptions4);

var LineItems = [new estimateLineItem(estimateLineItemOptions1)];

var estimateOptions = {
  
  ID : 201,
  Status : 1, //Setting the estimate status to active
  CreatedDate : new Date(), //Set estimateCreatedDate to current date; 
  LineItemSet: LineItems,
//  Subtotal: 50,
  }


// Create a Test Suite
vows.describe('Estimate').addBatch({
 'An Estimate': {

     'with some data': {
      topic: new Estimate(estimateOptions),

      'id should be 99': function (topic) {
        assert.equal(topic.ID, 201);
      },
      'first name should be 1': function (topic) {
        assert.equal(topic.Status, 1);
      },
      'should be current date': function (topic) {
        assert.equal(topic.CreatedDate, date);
       },
//	  'line item': function (topic) {
//        assert.equal(topic.estimateLineItemSet.length, 1);
//     },
    },

		'add calculate subtotal': {
     
	 topic: new Estimate(estimateOptions),
      'calculate subtotal': function (topic) {
				topic.calculateFinalTotal(100);
		'check that Subtotal is correct'
		assert.equal(topic.FinalTotal, 50);
		},
    },
	
	'add one line item': {
     
	 topic: new Estimate(estimateOptions),
      'add 1 line items': function (topic) {
				topic.addEstimateLineItem(estimateLineItem2);
				topic.calculateSubTotal();
				topic.calculateFinalTotal(topic.Subtotal);
		'check that Subtotal is correct'
		assert.equal(topic.estimateLineItemSet.length, 2);
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
				topic.calculateSubTotal();
				topic.calculateFinalTotal(topic.Subtotal);
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
				topic.calculateSubTotal();
				topic.calculateFinalTotal(topic.Subtotal);
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
				topic.calculateSubTotal();
				topic.calculateFinalTotal(topic.Subtotal);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 25);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 28.75);
		},
    },

   },
}).export(module); // Run it


/*
// Create a Test Suite
vows.describe('EstimateLineItem').addBatch({
 'An EstimateLineItem': {

     'with some data': {
      topic: new EstimateLineItem(estimateLineItemOptions1),

      'id should be 99': function (topic) {
        assert.equal(topic.id, 201);
      },
      'first name should be 1': function (topic) {
        assert.equal(topic.name, 1);
      },
      'should be current date': function (topic) {
        assert.equal(topic.description, date);
       },
//	  'has no lineitem(should be an empty lineitem array)': function (topic) {
//        assert.equal(topic.estimateLineItemSet.length, 1);
       },
    },
 }).export(module); // Run it*/

