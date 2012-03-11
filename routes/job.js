var mongoose = require('mongoose')
  , Job = require('./../models').Job
  , breadcrumbs = require('./../breadcrumbs')
  , Customer = require('./../models').Customer
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , jobValidator = require('./../validators.js').jobValidator
  , ObjectId = mongoose.Types.ObjectId;


exports.all = function (req, res) {
  //console.log("all jobs route");
  //console.log("req.currentUser: %o", req.currentUser);
  res.render('job/jobs',
    {
      layout: 'includes/layout',
      title: 'Jobs',
      errors: false
    });
};

 
exports.add = function(req, res) {
  //console.log("add job route");

  var job = new Job(req.body.job);
  job.customerID = new ObjectId(req.params.id);
  //console.log("job: %o", job);
  function jobSaveFailed() {
    console.log("failed creating job");
    req.session.breadcrumb = breadcrumb;
    res.render('customer/custDetails/',
    {
      layout: 'includes/layout',
      title: 'Customer',
      errors: false,
      breadcrumb: breadcrumb,
    });
  }

  job.save(function(err) {
    if (err) {
      console.log("err: " + err);
      return jobSaveFailed();
    } 
    //console.log("creating job");
    res.redirect('/customer/' + job.customerID);
    // req.flash('info', 'Job has been added');
  });
};

exports.edit = function (req, res) {
  //console.log("edit job route");
  var formJob = req.body.formJob;
  function jobEditFailed() {
    console.log("edit job FAIL");
    res.render('job/jobDetails',
    {
      layout: 'includes/layout',
      title: 'Job',
      job: formJob,
      errors: false
    });
  };

  var conditions = { _id : new ObjectId(formJob.id) }
    , update = { name : formJob.name
                    , description : formJob.description
                    }
  ;
  Job.update(conditions, update, function (err, numAffected) {
    if(err || numAffected == 0){
      console.log("err: " + err);
      return jobEditFailed();
    }
    //console.log("Editing SUCCEED");
    res.redirect('/job/' + formJob.id);
  });
};

exports.findAll = function (req, res) {
  //console.log("all jobs route");

 Job.find({}, function (err, jobs) {
    //console.log("Find Job ");
    if(jobs){
      //console.log("get all jobs success");
      var dataSet = new Array();
      for(i = 0; i < jobs.length; i++){
        dataSet.push([
           jobs[i]._id,
            jobs[i].name,
            jobs[i].description,
            jobs[i].creationDate,
            jobs[i].status,
            jobs[i].customerID
        ]);
      }

      var aaData = {
        "aaData" : dataSet
      };

      res.json(aaData);
    }
    else {
      console.log("get all jobs Not success");
    }
  });
};

exports.getCustJobs = function (req, res) {
  Job.find({ customerID : new ObjectId(req.params.id) }, function (err, jobs) {
    //console.log("The current customer is " + req.params.id);
    if(jobs){
      //console.log("get all this customers jobs success: " + jobs.length);
      var dataSet = new Array();
      for(i = 0; i < jobs.length; i++){
        dataSet.push([
            jobs[i]._id,
            jobs[i].name,
            jobs[i].description,
            jobs[i].estimateSet.length,
            new Date(jobs[i].creationDate).toDateString(),
            jobs[i].status
        ]);
      }
      var aaData = {
        "aaData" : dataSet
      };
      res.json(aaData);
    }
    else
    {
      console.log("get all this customers jobs Not success");
    }
  });
};


exports.details = function (req, res) {
  console.log("job details route");
  console.log("job ID: " + req.params.id);

  Job.findOne({ _id : new ObjectId(req.params.id) }, function (err, job) {
    if(!job) {
      console.log("get specific job not successful");
    }
    else {
      console.log("job found");
      breadcrumbs.createBreadcrumb({ customerID: job.customerID }, function (breadcrumb) {
        console.log("breadcrumb: ", breadcrumb);
        breadcrumb["job"] = {
          id : job._id,
          name : job.name
        };
        console.log("breadcrumb: ", breadcrumb);
        res.render('job/jobDetails',
          {
            layout: 'includes/layout',
            title: 'Job',
            job: job,
            breadcrumb: breadcrumb,
            errors: false
          }
        );
      });
    }
  });
};

exports.validateJob = function (req, res, next) {
  console.log("validating the job");
  
var job = new Job(req.body.job);

  var errors = jobValidator(req.body.job, function (err) {
    if (Object.keys(err).length) {

     console.log("HAS ERRORS rendering create again");
     Customer.findOne({ _id : new ObjectId(req.params.id) }, function (err, customer){
              
              var breadcrumb = req.session.breadcrumb;  
              res.render('customer/custDetails',
                { 
                    layout: 'includes/layout',
                    title: 'Customer',
                    customer: customer,
                    breadcrumb: breadcrumb,
                    errors: false
                }
              );
              
      });

      return false;
    }
    next();  
  });
  
}


exports.validateEditJob = function (req, res, next) {
  console.log("validating the job");

  var errors = jobValidator(req.body.formJob, function (err) {
    if (Object.keys(err).length) {
      console.log("HAS ERRORS rendering create again");
      res.render('job/jobDetails',
        { 
          layout: "includes/layout",
          title: "Job",
          job: req.body.formJob,
          errors: err 
        }
      );
      return false;
    }
    next();  
  });
  
}
