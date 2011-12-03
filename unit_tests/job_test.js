var vows = require('vows'),
    assert = require('assert');

var models = require('../classes/model.js');
var Job = models.Job;

var currentDate = new Date();

var jobOptions = {
    id: 4,
    name: "Window installation",
    description: "New window installation for second level of two story house",
    creationDate: currentDate, // should be changed to some date in the past
    status: "Active",
    scheduleDates: ["04/02/2011"],
    estimateSet: [new Estimate(), new Estimate()],
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
            'creationDate should be today': function (topic) {
                assert.equal(topic.CreationDate, currentDate);
            },
            'status should be active': function (topic) {
                assert.equal(topic.Status, "Active");
            },
            'scheduleDates should be "4/2/2011"': function (topic) {
                assert.equal(topic.ScheduleDates, "4/2/2011");
            },
            'estimateSet should have 2 estimates': function (topic) {
                assert.equal(topic.EstimateSet.length, 2);
            },
        },
        // BEGIN A2 UNIT TESTS
        'with no estimates and status Active': {
            topic: new Job(),

            'should allow estimate to be added': function (topic) {
                var isAdded = topic.addEstimate(new Estimate());
                assert.isTrue(isAdded);
            },
        },
        'with no estimates and status Completed': {
            topic: function () {
                var testJob = new Job();
                testJob.Status = "Completed";
                return testJob;
            },
            'should not allow estimate to be added': function (topic) {
                var isAdded = topic.addEstimate(new Estimate());
                assert.isFalse(isAdded);
            },
        },
        'with no estimates and status Cancelled': {
            topic: function () {
                var testJob = new Job();
                testJob.Status = "Cancelled";
                return testJob;
            },
            'should not allow estimate to be added': function (topic) {
                var isAdded = topic.addEstimate(new Estimate());
                assert.isFalse(isAdded);
            },
        },
        'with scheduled job in the future': {
            topic: function () {
                var testJob = new Job(jobOptions);
                testJob.addScheduleDate("01/01/2013");
                return testJob;
            },

            'should not be allowed to be Completed': function (topic) {
                var isSet = topic.setStatus("Completed");
                assert.isFalse(isSet);
            },
        },
        'with no scheduled jobs in the future': {
            topic: new Job(jobOptions),

            'should be allowed to be Completed': function (topic) {
                var isSet = topic.setStatus("Completed");
                assert.isTrue(isSet);
            },
        },
    }
}).run(); // Run it    


/*
- should allow estimate to be added when job status is active
- should not allow estimate to be added when job status is completed
- add estimate, check how many estimates are in the set
- delete estimate, check how many estimates are in the set
*/