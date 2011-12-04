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
total: 0,
media: null,
};


var estimateLineItemOptions2 = {
id: 101,
name: 'Test2',
description: 'Test Item 2',
quantity: 5,
cost: 5,
total: 0,
media: null,
};


var estimateLineItemOptions3 = {
id: 102,
name: 'Test3',
description: 'Test Item 3',
quantity: 5,
cost: 5,
total: 0,
media: null,
};


var estimateLineItem1 = new estimateLineItem(estimateLineItemOptions1);
var estimateLineItem2 = new estimateLineItem(estimateLineItemOptions2);
var estimateLineItem3 = new estimateLineItem(estimateLineItemOptions3);


// Create a Test Suite
vows.describe('Estimate').addBatch({
  'A Estimate': {
	
    'with 3 jobs': {
      topic: new Estimate(estimateOptions),
      'has a length of 3': function (topic) {
        assert.equal(topic.calculateSubTotal(), 50);
      },
      'after adding one, has a length of 4': function (topic) {
        topic.addEstimateLineItem(estimateLineItem1);
        assert.equal(topic.calculateFinalTotal(), 57.5);
      },
      'after deleting one, has again a length of 3': function (topic) {
        // console.log("job.Id: " + job.Id);
        topic.removeEstimateLineItem(estimate.Id);
        assert.equal(topic.calculateSubTotal(), 25);
      },

      'after deleting one, has again a length of 3': function (topic) {
        // console.log("job.Id: " + job.Id);
        topic.removeEstimateLineItem(estimate.Id);
        assert.equal(topic.calculateFinalTotal(), 28.75);
      },	  
   },

   },
}).export(module); // Run it