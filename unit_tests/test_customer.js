// Test Customer

var vows = require('vows'),
    assert = require('assert');
    
var models = require('../classes/model.js');

var Customer = models.Customer;
var Job = models.Job;
var Estimate = models.Estimate;
var LineItem = models.LineItem;
    



var customerOptions = {
  id: 99,
  fname: 'Joe',
  lname: 'Doe',
  email: 'joe@doe.com',
  phone: '(123) 345-6789',
  street1: '70 Pond Road',
  street2: '1760 Finch Av. West',
  postal: 'M7T DS2',
  date: date,
  status: 'active',
  jobs: [new Job(), new Job(), new Job()],
  notes: [new Note(), new Note()],
}

var d = new Date();
var date = d.getDay() + '-' + d.getDate() + '-' + d.getFullYear();

var noteOptions = {
  id: 1,
  content: "A Reminder",
  date: date,
};

var note = new Note(noteOptions);

var jobOptions = {
  id: 420,
};
var job = new Job(jobOptions);

// Create a Test Suite
vows.describe('Customer').addBatch({
  'A Customer': {
    'in a safe empty state': {    
      topic: new Customer(),
      'id is 0': function (topic) {
        assert.equal(topic.Id, 0);
       },
      'first name is empty': function (topic) {
        assert.equal(topic.FirstName, "");  
       },
      'last name is empty': function (topic) {
        assert.equal(topic.LastName, "");
       },
      'email is empty': function (topic) {
        assert.equal(topic.Email, "");
       },
      'phone is empty': function (topic) {
        assert.equal(topic.Phone, "");
       },
      'street1 is empty': function (topic) {
        assert.equal(topic.Street1, "");
       },
      'street2 is empty': function (topic) {
        assert.equal(topic.Street2, "");
       },
       'postal is empty': function (topic) {
        assert.equal(topic.Postal, "");
       },
      'date is the current date': function (topic) {
        
        assert.equal(topic.Date, date);
       },
      'status is Active': function (topic) {
        assert.equal(topic.Status, 'active');
       },
      'has no jobs(should be an empty jobs array)': function (topic) {
        assert.equal(topic.Jobs.length, 0);
       },
      'has no notes(should be an empty notes array)': function (topic) {
        assert.equal(topic.Notes.length, 0);
       },
    },

    'with some data': {
      topic: new Customer(customerOptions),

      'id should be 99': function (topic) {
        assert.equal(topic.Id, 99);
      },
      'first name should be Joe': function (topic) {
        assert.equal(topic.FirstName, "Joe"); 
      },
      'last name should be Doe': function (topic) {
        assert.equal(topic.LastName, "Doe");  
      },
      'email should be joe@doe.com': function (topic) {
        assert.equal(topic.Email, "joe@doe.com"); 
      },
      'phone should be (123) 345-6789': function (topic) {
        assert.equal(topic.Phone, "(123) 345-6789");  
      },
      'street1 should be 70 Pond Road': function (topic) {
        assert.equal(topic.Street1, "70 Pond Road");  
      },
      'street2 1760 Finch Av. West': function (topic) {
        assert.equal(topic.Street2, "1760 Finch Av. West"); 
      },
      'postal should be M7T DS2': function (topic) {
        assert.equal(topic.Postal, "M7T DS2");  
      },
      'date should be the current date when the customer was created': function (topic) {
        assert.equal(topic.Date, date); 
      },
      'status should be Active': function (topic) {
        assert.equal(topic.Status, "active"); 
      },
      'has 3 job': function (topic) {
        assert.equal(topic.Jobs.length, 3); 
      },
      'has 2 notes': function (topic) {
        assert.equal(topic.Notes.length, 2);  
      },
    },
    'with 3 jobs': {
      topic: new Customer(customerOptions),
      'has a length of 3': function (topic) {
        assert.equal(topic.totalJobs(), 3);
      },
      'after adding one, has a length of 4': function (topic) {
        topic.addJob(job);
        assert.equal(topic.totalJobs(), 4);
      },
      'after deleting one, has again a length of 3': function (topic) {
        // console.log("job.Id: " + job.Id);
        topic.deleteJob(job.Id);
        assert.equal(topic.totalJobs(), 3);
      },
    },
    'with 0 notes': {
      topic: new Customer(),
      'has a length of 0': function (topic) {
        assert.equal(topic.totalNotes(), 0);
      },
      'after adding one, has a length of 1': function (topic) {
        topic.Notes.push(note);
        assert.equal(topic.totalNotes(), 1);
      },
      'after deleting one, has again a length of 0': function (topic) {
        // console.log("\n\nnote.Id: " + note.Id);
        topic.deleteNote(note.Id);
        assert.equal(topic.totalNotes(), 0);
      },
    },
    'with an archived status and 0 jobs': {
      topic: function () {
        var c = new Customer();
        c.Status = 'archived';
        return c;
      },
      'should not be able to add a new job, job length should be 0': function (topic) {
        // console.log("topic.Status: " + topic.Status);
        topic.addJob(job);
        assert.equal(topic.totalJobs(), 0);
      },
    },
    'with 1 job containing 1 estimate': {
      topic: function () {
        // console.log("\n\n\nwith 1 job containing 1 estimate\n\n");
        var c = new Customer();
        // console.log("c status: " + c.Status);
        // console.log("c totalJobs: " + c.totalJobs());
        var j = new Job();
        j.Id = 420;
        j.addEstimate(new Estimate());
        c.addJob(j);
        return c;
      },
      'should not be able to delete the job, since it has one estimate. Job length should be 1': function (topic) {
        // console.log("topic.Status: " + topic.Status);
        topic.deleteJob(420);
        assert.equal(topic.totalJobs(), 1);
      },
    },
   },
}).export(module); // Run it
