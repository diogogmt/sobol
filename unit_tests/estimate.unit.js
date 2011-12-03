var vows = require('vows'),
    assert = require('assert');

var estimate = require('../classes/model.js');

var Estimate = models.Estimate;
var EstimateLineItem = models.EstimateLineItem;

var estimateOptions = {
ID 201
Status 1 //Setting the estimate status to active
LineItemSet : [new estimateLineItem(estimateLineItem1)];
CreatedDate =  new Date(); //Set estimateCreatedDate to current date; 

},

var estimateLineItem1= {


}

var estimateLineItem2= {


}

var estimateLineItem3= {


}

var estimateLineItem4= {


}


vows.describe('Customer').addBatch() 
{

'Calculate Subtotal and Final Total after adding one line item': {
    : {
      topic: new Estimate(estimateOptions),
      : function (topic) {
				topic.addEstimateLineItem(estimateLineItem2);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 0);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 0);
		},
   
		}
   
	}
'Calculate Subtotal and Final Total after adding two line items': {
    : {
      topic: new Estimate(estimateOptions),
      : function (topic) {
				topic.addEstimateLineItem(estimateLineItem3);
				topic.addEstimateLineItem(estimateLineItem4);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 0);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 0);
		},
   
		}
   
	}


'Calculate Subtotal and Final Total after removing one line items': {
    : {
      topic: new Estimate(estimateOptions),
      : function (topic) {
				topic.removeEstimateLineItem(estimateLineItem2);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 0);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 0);
		},
   
		}
   
	}

'Calculate Subtotal and Final Total after removing two line items': {
    : {
      topic: new Estimate(estimateOptions),
      : function (topic) {
				topic.removeEstimateLineItem(estimateLineItem3);
				topic.removeEstimateLineItem(estimateLineItem4);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 0);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 0);
		},
   
		}
   
	}

}
  
