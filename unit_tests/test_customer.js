// Test Customer

var vows = require('vows'),
    assert = require('assert');
    
var models = require('../classes/model.js');

var Customer = models.Customer;
var Job = models.Job;
    
var customerOptions = {
	id: 99,
	jobs: [new Job(), new Job(), new Job()],
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
				// get first name
       },
      'last name is empty': function (topic) {
				// get last name
       },
      'email is empty': function (topic) {
				// get email 
       },
      'phone is empty': function (topic) {
				// get phone 
       },
      'postal is empty': function (topic) {
				// get postal 
       },
      'street1 is empty': function (topic) {
				// get street1
       },
      'street2 is empty': function (topic) {
				// get street2 
       },
      'date is the current date': function (topic) {
				// get date 
       },
      'status is Active': function (topic) {
				// get status name
       },
      'has no jobs(should be an empty jobs array)': function (topic) {
				// get jobs 
       },
      'has no notes(should be an empty notes array)': function (topic) {
				// get notes 
       },
		},
		'with some data': {
    	topic: new Customer(customerOptions),

      'id should be 99': function (topic) {
				assert.equal(topic.Id, 99);
    	},
      'first name should be Joe': function (topic) {
				// get first name
      },
      'last name should be Doe': function (topic) {
				// get last name
      },
      'email should be joe@doe.com': function (topic) {
				// get email 
      },
      'phone should be (123) 345-6789': function (topic) {
				// get phone 
      },
      'postal should be M7T DS2': function (topic) {
				// get postal 
      },
      'street1 should be 70 Pond Road': function (topic) {
				// get street1
      },
      'street2 1760 Finch Av. West': function (topic) {
				// get street2 
      },
      'date should be the current date when the customer was created': function (topic) {
				// get date 
      },
      'status should be Finished': function (topic) {
				// get status name
      },
      'has 1 job': function (topic) {
				// get jobs 
      },
      'has 2 notes': function (topic) {
				// get notes 
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
