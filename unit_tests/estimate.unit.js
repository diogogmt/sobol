var vows = require('vows'),
    assert = require('assert');
    
var models = require('../classes/model.js');

var Estimate = models.Estimate;
var EstimateLineItem = models.EstimateLineItem;
    
var d = new Date();
var date = d.getDay() + '-' + d.getDate() + '-' + d.getFullYear();
    
var estimateLineItemOptions = {
id : 2,
total : 5,
};


var estimateOptions = {
  
  ID : 201,
  Status : 1, //Setting the estimate status to active
  estimateLineItemSet : [new EstimateLineItem(), new EstimateLineItem()],
  CreatedDate : new Date(), //Set estimateCreatedDate to current date; 
  };
  
  var estimateLineItem = new EstimateLineItem();

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
    },

		'add calculate subtotal': {
     
	 topic: new Estimate(estimateOptions),
      'calculate subtotal': function (topic) {
				topic.calculateFinalTotal(10);
		'check that Subtotal is correct'
		assert.equal(topic.FinalTotal, 11.50);
		},
    },
	
	'add one line item': {
     
	 topic: new Estimate(estimateOptions),
      'add 1 line items': function (topic) {
				topic.addEstimateLineItem(estimateLineItem);
				topic.calculateSubTotal();
				topic.calculateFinalTotal(topic.Subtotal);
		'check that Subtotal is correct'
		
		assert.equal(topic.ID, 201);
		assert.equal(topic.Status, 1);
		
		assert.equal(topic.estimateLineItemSet.length, 2);
//		assert.equal(topic.Subtotal, 50);
		'check that Final total is correct'
//		assert.equal(topic.FinalTotal, 57.5);
		},
    },

    'add 2 line items': {
      topic: new Estimate(estimateOptions),
      'add 2 line items': function (topic) {
				topic.addEstimateLineItem(estimateLineItem);
				topic.addEstimateLineItem(estimateLineItem);
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
				topic.removeEstimateLineItem(estimateLineItem.id);
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
				topic.removeEstimateLineItem(estimateLineItem.id);
				topic.removeEstimateLineItem(estimateLineItem.id);
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

