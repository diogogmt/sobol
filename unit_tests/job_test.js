var vows = require('vows'),
    assert = require('assert');

var job = require('../classes/job.js');
var Job = job.Job;

// Create a Test Suite
vows.describe('Division by Zero').addBatch({
    'when dividing a number by zero': {
        topic: function () { return 42 / 0 },

        'we get Infinity': function (topic) {
            assert.equal (topic, Infinity);
        }
    },
    'but when dividing zero by zero': {
        topic: function () { return 0 / 0 },

        'we get a value which': {
            'is not a number': function (topic) {
                assert.isNaN (topic);
            },
            'is not equal to itself': function (topic) {
                assert.notEqual (topic, topic);
            }
        }
    },
    'A Job': {
        topic: new(Job),

        'is active': function (topic) {
            assert.equal (topic.jobStatus, 'Active');
        },
        'and is function active': function (topic) {
            assert.isTrue (topic.isActive());
        }
    }
}).run(); // Run it