var vows = require('vows'),
    assert = require('assert');

var estimate = require('../classes/model.js');

var Estimate = models.Estimate;
var EstimateLineItem = models.EstimateLineItem;

var estimateOptions = {
ID : 201
Status  = 1 //Setting the estimate status to active
LineItemSet : [new estimateLineItem(estimateLineItem1)];
CreatedDate =  new Date(); //Set estimateCreatedDate to current date; 

},

var estimateLineItem1= {
id : 100,
name: 'Test1',
description: 'Test Item 1',
quantity 5,
cost 5,

}

var estimateLineItem2= {
id : 101,
name: 'Test2',
description: 'Test Item 2',
quantity 5,
cost 5,

}

var estimateLineItem3= {
id : 102,
name: 'Test3',
description: 'Test Item 3',
quantity 5,
cost 5,

}

var estimateLineItem4= {
id : 103,
name: 'Test4',
description: 'Test Item 4',
quantity 5,
cost 5,
}


vows.describe('Customer').addBatch() 
{

'Calculate Subtotal and Final Total after adding one line item': {
    : {
      topic: new Estimate(estimateOptions),
      : function (topic) {
				topic.addEstimateLineItem(estimateLineItem2);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 50);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 57.5);
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
		assert.equal(topic.Subtotal, 100);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 115);
		},
   
		}
   
	}


'Calculate Subtotal and Final Total after removing one line items': {
    : {
      topic: new Estimate(estimateOptions),
      : function (topic) {
				topic.removeEstimateLineItem(estimateLineItem2);
		'check that Subtotal is correct'
		assert.equal(topic.Subtotal, 75);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 86.25);
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
		assert.equal(topic.Subtotal, 25);
		'check that Final total is correct'
		assert.equal(topic.FinalTotal, 28.75);
		},
   
		}
   
	}

}
  
