// Test Customer

var vows = require('vows'),
    assert = require('assert');
    
var models = require('../classes/model.js');

var Customer = models.Customer;
var Job = models.Job;
    
var d = new Date();
var date = d.getDay() + '-' + d.getDate() + '-' + d.getFullYear();


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
  status: 'finished',
  jobs: [new Job(), new Job(), new Job()],
  notes: [new Note(), new Note()],
}

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
      'status should be Finished': function (topic) {
        assert.equal(topic.Status, "finished"); 
      },
      'has 3 job': function (topic) {
        assert.equal(topic.Jobs.length, 3); 
      },
      'has 2 notes': function (topic) {
        assert.equal(topic.Notes.length, 2);  
      },
    },
    'with 3 active jobs': {
      topic: new Customer(customerOptions),
      'has a length of 3': function (topic) {
        assert.equal(topic.Jobs.length, 3);
      },
      'after setting one to finished, has a length of 2': function (topic) {
        // set job1 status to finished
      },
      'now has one finished job': function (topic) {
        // get length of finished jobs
      },
      'after adding one active job, has again a length of 3': function (topic) {
        // get length of active jobs
      },
      'after setting all jobs to finished, has length of 0': function (topic) {
        // set status finished for all jobs
      },
      'total number o jobs should 4 by now (active and finished)': function (topic) {
        // count the number of jobs
      },
    },
    'with 0 notes': {
      topic: new Customer(),
      'has a length of 0': function (topic) {
        // get length of notes
      },
      'after adding one, has a length of 1': function (topic) {
        // add a new note
        // get length of notes
      },
      'after deleting one, has again a length of 0': function (topic) {
        // delete note
        // get length of notes
      },
    },
    'with an archived status': {
      topic: new Customer(),
      'should not be able to add a new job': function (topic) {
        // try to add a new job to customer
      },
    },
   },
}).export(module); // Run it
