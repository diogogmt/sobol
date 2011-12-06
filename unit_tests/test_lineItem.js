// Test Customer

var vows = require('vows'),
    assert = require('assert');
    
var models = require('../classes/model.js');

var EstimateLineItem = models.EstimateLineItem;
var Media = models.Media;
    
var LineItemOptions = {
  cost: 10,
};

// Create a Test Suite
vows.describe('Estimate Line Item').addBatch({
  'An Estimate Line Item': {
    'withouth a media': {
      topic: new EstimateLineItem(),
      'after adding one media, has one media': function (topic) {
        topic.addMedia(new Media());
        assert.instanceOf(topic.getMedia(), Media);
      },
      'trying to add one more media, still has a length of one (LineItem can only have 1 media)': function (topic) {
        topic.addMedia(new Media());
        assert.instanceOf(topic.getMedia(), Media);
      }
    },
    'with one item costing 10': {
      topic: new EstimateLineItem(LineItemOptions),
      'total should be 10': function (topic) {
        assert.equal(topic.calcTotal(), 10);
      },
      'adding another item, total should be 20': function (topic) {
        topic.Quantity = 2;
        assert.equal(topic.calcTotal(), 20);
      }
    },
  },
}).export(module); // Run it




