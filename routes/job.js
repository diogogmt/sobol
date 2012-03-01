var mongoose = require('mongoose')
  , Job = require('./../models').Job
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , ObjectId = mongoose.Types.ObjectId;



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
  job.customerID = new ObjectId(req.params.id);
  console.log("job: %o", job);
  function jobSaveFailed() {
    console.log("failed creating job");
    res.render('customer/custDetails/', 
    {
      layout: 'includes/layout',
      title: 'Customer'
    });
  }

  job.save(function(err) {
    if (err) {
      console.log("err: " + err);
      return jobSaveFailed();
    } 
    console.log("creating job");
    res.redirect('/customer/' + job.customerID);
    // req.flash('info', 'Job has been added');
  });  
};

exports.edit = function (req, res) {
  console.log("edit job route");
  var formJob = req.body.formJob;
  function jobEditFailed() {
    console.log("edit job FAIL");
    res.render('job/jobDetails', 
    {
      layout: 'includes/layout',
      title: 'Job',
      job: formJob
    });
  };

  var conditions  = { _id : new ObjectId(formJob.id) }
    , update      = { name : formJob.name
                    , description : formJob.description
                    }
  ;
  Job.update(conditions, update, function (err, numAffected) {
    if(err || numAffected == 0){
      console.log("err: " + err);
      return jobEditFailed();
    }
    console.log("Editing SUCCEED");
    res.redirect('/job/' + formJob.id);
  });
};

exports.findAll = function (req, res) {
  console.log("all jobs route");

 Job.find({}, function (err, jobs) {
    console.log("Find Job ");
    if(jobs){
      console.log("get all jobs success");
      var dataSet = new Array();
      for(i = 0; i < jobs.length; i++){
        dataSet.push([
            jobs[i]._id,
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
  Job.find({ customerID : new ObjectId(req.params.id) }, function (err, jobs) {
    //console.log("The current customer is " + req.params.id);
    if(jobs){
      console.log("get all this customers jobs success: " + jobs.length);
      var dataSet = new Array();
      for(i = 0; i < jobs.length; i++){
        dataSet.push([
            jobs[i]._id,
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
  //console.log("job ID: " + req.params.id);

  Job.findOne({ _id : new ObjectId(req.params.id) }, function (err, job) {
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
