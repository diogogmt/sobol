var vows = require('vows'),
    assert = require('assert');

var models = require('../classes/model.js');
var Job = models.Job;

var jobOptions = {
    id: 4;
    name: "Window installation";
    description: "New window installation for second level of two story house";
    creationDate: new Date(); // should be changed to some date in the past
    status: "Active";
    scheduleDates: "04/02/2011";
    estimateSet: [new Estimate(), new Estimate()];
}

// Create a Test Suite
vows.describe('Job').addBatch({
    'A Job': {
        'in a safe empty state': {
            topic: new Job(),

            'id is 0' : function (topic) {
                assert.equal(topic.Id, 0);
            },
            'name is empty' : function (topic) {
                assert.equal(topic.Name, "");
            },
            'description is empty' : function (topic) {
                assert.equal(topic.Description, "");
            },
            'creationDate is current date' : function (topic) {
                assert.equal(topic.CreationDate, "");
            },
            'status is active' : function (topic) {
                assert.equal(topic.status, "Active");
            },
            'scheduleDates is empty' : function (topic) {
                assert.equal(topic.ScheduleDates, "");
            },
            'estimateSet is empty' : function (topic) {
                assert.equal(topic.EstimateSet.length, 0);
            },
        },
        'with some data': {
            topic: new Job(jobOptions),

            'id should be 4': function (topic) {
                assert.equal(topic.Id, 4);
            },
            'name should be "Window installation"': function (topic) {
                assert.equal(topic.Name, "Window installation");
            },
            'description should be "New window installation for second level of two story house"' : function (topic) {
                assert.equal(topic.Description, "New window installation for second level of two story house");
            },
            'creationDate should be XXXXXXX': function (topic) {
                assert.equal(topic.creationDate, XXXXXXX);
            },
            'status should be active': function (topic) {
                assert.equal(topic.status, "Active");
            },
            'scheduleDates should be "4/2/2011"': function (topic) {
                assert.equal(topic.ScheduleDates, "4/2/2011");
            },
            'estimateSet should have 2 estimates': function (topic) {
                assert.equal(topic.EstimateSet.length, 2);
            },
        },
        'with an active status': {
            topic: new Job(),
            'is active': function (topic) {
                assert.equal (topic.getStatus(), 'Active');
            },
            'and is function active': function (topic) {
                assert.isTrue (topic.isActive());
            }
        },
        'with no estimates': {
            topic = new Job(),

            'should allow estimate to be added when job status is active': function (topic) {
                var isAdded = topic.addEstimate(new Estimate());
                assert.isTrue(isAdded);
            },
            'should not allow estimate to be added when job is completed': function (topic) {
                topic.Status = "Completed";
                var isAdded = topic.addEstimate(new Estimate());
                assert.isFalse(isAdded);
            },
            'should not allow estimate to be added when job is cancelled': function (topic) {
                topic.Status = "Cancelled";
                var isAdded = topic.addEstimate(new Estimate());
                assert.isFalse(isAdded);
            },
        },
        'with three estimates': {
            topic = new Job(jobOptions),

            'should not be allowed to be Completed if there is scheduled job in the future': function (topic) {
                var currentDate = new Date();
                topic.addScheduleDate("01/01/2012");
                var isSet = topic.setStatus("Completed");
                assert.isFalse(isSet);
            },
            'should be allowed to be Completed if there are no scheduled jobs in the future': function (topic) {
                var currentDate = new Date();
                topic.addScheduleDate("01/01/2011");
                var isSet = setStatus("Completed");
                assert.isTrue(isSet);
            },
        }
    }
}).run(); // Run it    


/*
- should allow estimate to be added when job status is active
- should not allow estimate to be added when job status is completed
- add estimate, check how many estimates are in the set
- delete estimate, check how many estimates are in the set
*/