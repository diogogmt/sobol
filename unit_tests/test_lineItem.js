var vows = require('vows'),
  assert = require('assert');

var model = require('../BTS530/model.js);

var estimateLineItem = model.estimateLineItem;
var Media = model.Media; 

var lineItemOptions = {
  id: 12,
  name: 'bracket window',
  description: 'Window for living room',
  quantity: '1',
  cost: '$300',
  total: '$300',
  media: Media(),
}

vows.describe('Line Item').addBatch({

//add quantity of 1 and calcualte total
'Calcualte Total after adding a quantity of 1': {
  topic: new estimateLineItem(lineItemOptions),
    function (topic) {
    topic.addQuantity(quantity);
    assert.equal(topic.quantity, 1);
    assert.equal(topic.total, $300);
  },
  },
  
//add quantity of 2 and calculate total 
'Calculate Total after adding a quantity of 2' :{ 
  topic: new estimateLineItem(lineItemOptions),
   function (topic) {
    topic.addQuantity(quantity);
    topic.addQuantity(quantity);
    assert.equal(topic.quantity, 2);
    assert.equal(topic.total, $600);
  },
  },
  
//add 1 media 
'Add 1 media' :{
  topic: new estimateLineItem(lineItemOptions),
  function (topic) {
    topic.addMedia(media);
    assert.equal(topic.media, 0);
  },
  },
  
//add 2 media give error
'Add 2 Media give error' :{
  topic: new estimateLineItem(lineItemOptions),
  function (topic) {
    topic.addMedia(media);
    topic.addMedia(media):
    assert.equal(topic.media, 0 );
  },
},
    
}).export();



