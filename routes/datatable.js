var mongoose = require('mongoose')
  , Customer = require('./../models').Customer
  , Job = require('./../models').Job
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , customerValidator = require('./../validators.js').customerValidator
  , ObjectId = mongoose.Types.ObjectId;



exports.customers = function (req, res) {
  console.log("req.query: ", req.query);
  var status = req.query.status || "Active";
  console.log("status: ", status);
  Customer.find({"status": status}, function (err, customers) {
    var dataSet = new Array()
      , i = (customers && customers.length) || 0;

    if (!i) {
      return res.json({"aaData": dataSet})
    }
    while (i--) {
      console.log("i: ", i);
      (function (i) {
        var customer = customers[i];
        Job.count({"customerID": customer._id }, function (err, count) {
          dataSet.push([
            customer._id,
            customer.lastName,
            customer.firstName,
            customer.email,
            customer.phone1,
            count,
            new Date(customer.registrationDate).toDateString(),
            customer.status
          ]);
          !i ? res.json({"aaData": dataSet}) : 0;
        }); // END Job.count
      }(i)); // END Anonymous func
    } // END while

  }); // END Customer.find
};

exports.customerJobs = function (req, res) {
  var custId = req.params.id === "0" || !req.params.id
             ? null
             : req.params.id;
  console.log("custId: ", custId);
  if (!custId) {
    // TODO: create log module
    console.log("custId shouldn't be null");
  }
  Job.find({ "customerID": custId }, function (err, jobs) {
    var dataSet = new Array()
      , i = (jobs && jobs.length) || 0;

    if (!i) {
      return res.json({"aaData": dataSet})
    }
    while (i--) {
      dataSet.push([
        jobs[i]._id,
        jobs[i].name,
        jobs[i].description,
        jobs[i].estimateSet.length,
        new Date(jobs[i].creationDate).toDateString(),
        jobs[i].status
      ]);
    }
    res.json({"aaData": dataSet});
  });
};

exports.jobsList = function (req, res) {
  Job.find({}, function (err, jobs) {
    var dataSet = new Array()
    , i = (jobs && jobs.length) || 0;

    if (!i) {
      return res.json({"aaData": dataSet})
    }
    while (i--) {
      (function (i) {
        var job = jobs[i];
        Customer.findById(job.customerID , function (err, customer) {
          if (!customer) {
            // TODO implement ASSERTIONS. Look at how firefox does ASSERTIONS
            console.log("customer shouldn't be NULL, all jobs should have a customer")
          }
          var customerName = customer ? customer.lastName + ", " + customer.firstName : "";
          dataSet.push([
            job._id,
            job.name,
            job.description,
            job.creationDate,
            job.status,
            customerName
          ]);
          !i ? res.json({"aaData": dataSet}) : 0;
        }); // END Customer.findById
      }(i)); // END Anonymous func
    } // END while
  });
};

exports.jobEstimates = function (req, res) {
  var jobID = req.params.id;
  Job.findById(new ObjectId(jobID), ["estimateSet"], function (err, job) {
    if (!job) {
      // TODO implement ASSERTIONS. Look at how firefox does ASSERTIONS
      console.log("job shouldn't be NULL")
      return res.json({"aaData": dataSet})
    }

    var estimateSet = job.estimateSet
      , i = (estimateSet && estimateSet.length) || 0
      , dataSet = new Array();

    while(i--) {
      var estimate = estimateSet[i];
      dataSet.push([
        estimate._id,
        estimate.name,
        estimate.finalTotal,
        new Date(estimate.creationDate).toDateString(),
        estimate.status
      ]);
    }
    res.json({"aaData": dataSet})
  });
};

exports.estimateLineItems = function (req, res) {
  var params = req.params;
  var estimateId = params.estimateId;
  var jobId = params.jobId;

  Job.findById(new ObjectId(jobId), function (err, job) {
    if (!job) {
      // TODO implement ASSERTIONS. Look at how firefox does ASSERTIONS
      console.log("job shouldn't be NULL")
      return res.json({"aaData": dataSet})
    }

    var estimateSet = job.estimateSet
      , i = (estimateSet && estimateSet.length) || 0
      , dataSet = new Array();

    while (i--) {
      if (estimateSet[i]._id == estimateId) {
        var lineItemSet = estimateSet[i].lineItemSet
          , j = lineItemSet.length;
        while (j--) {
          var lineItem = lineItemSet[j];
          dataSet.push([
            lineItem._id,
            lineItem.name,
            lineItem.description,
            lineItem.quantity,
            lineItem.cost
          ]);
        }
      }
    }
    res.json({"aaData": dataSet})
  });
};

exports.customerNotes = function (req, res) {
  var customerId = req.params.id || 0;
  Customer.findById(customerId, function (err, customer) {
    if (!customer) {
      // TODO implement ASSERTIONS. Look at how firefox does ASSERTIONS
      console.log("customer shouldn't be NULL")
      return res.json({"aaData": dataSet})
    }

    var notes = customer.noteSet
      , i = (notes && notes.length) || 0
      , dataSet = new Array();

    while(i--) {
      var note = notes[i];
      dataSet.push([
        note._id,
        note.noteText,
        new Date(note.LastModifiedDate).toDateString(),
      ]);
    }
    res.json({"aaData": dataSet})
  });
}