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
  estimateLineItemSet : [new EstimateLineItem(estimateLineItemOptions1), new EstimateLineItem(estimateLineItemOptions2), 
  new EstimateLineItem(estimateLineItemOptions3), new EstimateLineItem(estimateLineItemOptions4)],
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
	  'should be 2 line items': function (topic) {
        assert.equal(topic.estimateLineItemSet.length, 4);
      },
    },

		'add calculate subtotal': {
     
	 topic: new Estimate(estimateOptions),
      'calculate subtotal': function (topic) {
				topic.calculateFinalTotal(20);
		'check that Subtotal is correct'
		assert.equal(topic.FinalTotal, 23.00);
		},
    },

	   'drop 2 line items': {
	    topic: new Estimate(estimateOptions ),
       'drop 2 line items': function (topic) {
				topic.removeEstimateLineItem(lineItem2.id);
				topic.removeEstimateLineItem(lineItem1.id);
				topic.calculateSubTotal();
				topic.calculateFinalTotal(topic.Subtotal);
		'Should be 2 line items'
		assert.equal(topic.estimateLineItemSet.length, 2);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 10);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 11.50);
		},
    },
	
	  'drop 1 line item': {
      topic: new Estimate(estimateOptions ),
      'drop 1 line items': function (topic) {
				topic.removeEstimateLineItem(lineItem5.id);
				topic.calculateSubTotal();
				topic.calculateFinalTotal(topic.Subtotal);
		'Should be 1 line items'
		assert.equal(topic.estimateLineItemSet.length, 1);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 5);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 5.75);
		},
    },
		
	'add one line item': {
     
	 topic: new Estimate(estimateOptions),
      'add 1 line items': function (topic) {
				topic.addEstimateLineItem(lineItem1);
				topic.calculateSubTotal();
				topic.calculateFinalTotal(topic.Subtotal);
		
		'Should be 3 line items'
		assert.equal(topic.estimateLineItemSet.length, 2);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 10);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 11.50);
		},
    },

    'add 2 line items': {
      topic: new Estimate(estimateOptions),
      'add 2 line items': function (topic) {
				topic.addEstimateLineItem(lineItem2);
				topic.addEstimateLineItem(lineItem3);
				topic.calculateSubTotal();
				topic.calculateFinalTotal(topic.Subtotal);
		'Should be 5 line items'
		assert.equal(topic.estimateLineItemSet.length, 4); //should really be 4
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 20);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 23.00);
		},
    },
	
   },
}).export(module); // Run it*/


/*
/////////////////////////////////////////////////////////////////////////////
// Create a Test Suite
vows.describe('EstimateLineItem').addBatch({
 'An EstimateLineItem': {

     'with some data': {
      topic: new EstimateLineItem(estimateLineItemOptions),

      'id should be 99': function (topic) {
        assert.equal(topic.id, 2);
      },
      'first name should be 1': function (topic) {
        assert.equal(topic.total, 5);
      },
				},
    },
 }).export(module); // Run it*/


////////////////////////////////////////////////////////////////////////////////////


