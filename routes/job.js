var mongoose = require('mongoose')
  , models = require('./../models')
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema;


models.defineModels(function() {
  Job = mongoose.model('Job');
});

exports.all = function (req, res) {
  console.log("all jobs route");
  console.log("req.currentUser: %o", req.currentUser);
  res.render('customer/customers', 
    {
      layout: 'includes/layout',
      title: 'Jobs'
    });
};

 
exports.add = function(req, res) {
  console.log("add job route");

  var job = new Job(req.body.job);
  job.customerID = req.params.id;
  console.log("job: %o", job);
  function jobSaveFailed() {
    console.log("failed creating job");
    //need to confirm if we need to redirect to customers or job
  }

  Job.count({}, function (err, count) {
    console.log("Collection has " + count + " jobs");
    job.id = count + 1;
    job.save(function(err) {
      if (err) {
        console.log("err: " + err);
        return jobSaveFailed();
      } 
      console.log("creating job");
      res.redirect('/customer/' + job.customerID);
      // req.flash('info', 'Job has been added');
    });
  });  
};

exports.edit = function (req, res) {
  console.log("edit job route");
  var formJob = new Job(req.body.formJob);
  //console.log("customer: %o", req.body.cust);
  function jobEditFailed() {
    console.log("edit job FAIL");
    //req.flash('addError', 'Customer Add failed');
    res.render('job/jobDetails/', 
    {
      layout: 'includes/layout',
      title: 'Job',
      job: formJob
    });
  };

  console.log("The form job ID is: ", formJob.id);

  Job.findOne({id:formJob.id}, function(err, job) {
    if(job){
      job.customid = formJob.customid;
      job.name = formJob.name;
      job.description = formJob.description;

      job.save(function(err) {
        if (err){
          console.log("err: " + err);
          return jobEditFailed();
        }
        console.log("Editing SUCCEED");
        //req.flash('info', 'The customer has been added');
        res.redirect('/job/' + job.id);
      });
    }else{
      console.log("Job not found. This shouldn't happen");
      console.log("Edit job: ", formJob);
      res.render('job/jobDetails', 
      {
        layout: 'includes/layout',
        title: 'Job',
        job: formJob
      });
    }
  });
};

exports.findAll = function (req, res) {
  console.log("all customers route");

 Job.find({}, function (err, jobs) {
    console.log("Find Job ");
    if(jobs){
      console.log("get all jobs success");

      var dataSet = new Array();
      for(i = 0; i < jobs.length; i++){
        dataSet.push([
            jobs[i].id,
            jobs[i].customid,
            jobs[i].name,
            jobs[i].description,
            jobs[i].creationDate,
            jobs[i].status
      
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
  Job.find({customerID:req.params.id}, function (err, jobs) {
    console.log("The current customer is " + req.params.id);
    if(jobs){
      console.log("get all this customers jobs success");
      var dataSet = new Array();
      for(i = 0; i < jobs.length; i++){
        dataSet.push([
            jobs[i].id,
            jobs[i].customid,
            jobs[i].name,
            jobs[i].description,
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

  Job.findOne({id:req.params.id}, function (err, job) {
    if(!job){
      console.log("get specific job not successful");
    }else{
      console.log("Details job: ", job);
      res.render('job/jobDetails', 
        {
          layout: 'includes/layout',
          title: 'Job',
          job: job
        }
      );
    }
  });  
};