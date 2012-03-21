var mongoose = require('mongoose')
  , models = require('./../models')
  , Estimate = require('./../models').Estimate
  , Job = require('./../models').Job
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , breadcrumbs = require('./../breadcrumbs')
  , ObjectId = mongoose.Types.ObjectId;

exports.add = function (req, res) {
  console.log("add estimate route");
  var estimate = new Estimate(req.body.estimate);
  var jobID = new ObjectId(req.params.id);

  function estimateAddFailed() {
    console.log("add estimate FAIL");
    //req.flash('addError', 'Estimate Add failed');
    res.render('job/jobDetails',
    {
      layout: 'includes/layout',
      title: 'Job'
    });
  };

  // Get total number of estimates for all the jobs in the system 
  var estimateCount = 0;
  Job.find({}, function (err, jobs) {
   for(i = 0; i < jobs.length; i++){
     estimateCount = estimateCount + jobs[i].estimateSet.length;
   } 
   estimate.quoteID = estimateCount + 1;
  });

  Job.update(
    { "_id": jobID },
    { $push: {"estimateSet": estimate} },
    { upsert: false, safe:true },
      function (err) {
        console.log("Job.update - push estimateSet");
        console.log("err: ", err);
        if (err) {
          estimateAddFailed();
        }
        else {
          res.redirect('/job/' + jobID);
        }
      });
};

exports.edit = function (req, res) {
  console.log("edit estimate route");
  var formEstimate = req.body.formEstimate;
  var breadcrumb = req.session.breadcrumb;
  var jobID = breadcrumb.job.id;
  //console.log("customer: %o", req.body.cust);
  function estimateEditFailed() {
    console.log("edit estimate FAIL");
    //req.flash('addError', 'Estimate Edit failed');
    res.render('estimate/estimateDetails/', 
    {
      layout: 'includes/layout',
      title: 'Estimate',
      estimate: formEstimate
    });
  };

  Job.findOne({ _id : new ObjectId(jobID) }, function (err, job) {
    if(job){
      var estimateSet = job.estimateSet;
      var pid = job.PID;
      for(var i = 0; i < estimateSet.length; i++){
//****************
// If Estimate is selected, then set all other estimates to unused
        if(formEstimate.status == "Selected"){
            estimateSet[i].status = "Unused";
           pid = estimateSet[i].quoteID;
        }
// If Estimate is re-activated, then re-activate all estimates         
        if(formEstimate.status == "Active"){
            estimateSet[i].status = "Active";
           pid = 0;
        }

        if(estimateSet[i]._id == formEstimate.id){
          estimateSet[i].name = formEstimate.name;
          estimateSet[i].status = formEstimate.status;
          var conditions  = { _id : new ObjectId(jobID) }
            , update      = { estimateSet : estimateSet, PID : pid }
          ;
          Job.update(conditions, update, function (err, numAffected) {
            if (err || numAffected == 0){
              return estimateEditFailed();
            }
            //console.log("Editing Estimate SUCCESS", job);
            res.redirect('/job/' + jobID + '/estimate/' + formEstimate.id);
          });
        }
      }
    }else{
      console.log("finding job for edit estimate - Not success");
      return estimateEditFailed();
    }
  });
};

exports.details = function (req, res) {
  console.log("estimate details");
  var params = req.params;
  var jobId = params.jobId
    , estimateId = params.estimateId;

  Job.findOne({ "estimateSet._id" : new ObjectId(estimateId) }, function (err, job) {
    console.log("job: ", job);
    if(!job) {
      console.log("get specific job for estimate not successful");
    }
    else {
      var estimate;
      var estimates = job.estimateSet;
      if(estimates.length > 0){
        for(var i = 0; i < estimates.length; i++){
          //console.log("Found estimate: ", estimates[i]);
          //console.log("Comparing against ID: " + req.params.estimateId);
          if(estimates[i]._id == req.params.estimateId){
            estimate = estimates[i];
            break;
          }
        }
        breadcrumbs.createBreadcrumb({ customerID: job.customerID }, function (breadcrumb) {
          breadcrumb["job"] = {
            id : job._id,
            name : job.name
          };
          breadcrumb["estimate"] = {
            id : estimate._id,
            name : estimate.name
          };
          res.render('estimate/estimateDetails',
          {
            layout: 'includes/layout',
            title: 'Estimate',
            estimate: estimate,
            jobID: req.params.jobId,
            breadcrumb: breadcrumb
          });
        });
      }
      else{
        console.log("No estimates found for this job. This shouldn't be possible");
      }
    }
  });
};

exports.getJobEstimates = function (req, res) {
  console.log("job getJobEstimates");
  console.log("req.params: ", req.params);
  var jobID = req.params.id;
  console.log("jobID: ", jobID);


  Job.findById(new ObjectId(jobID), ["estimateSet"], function (err, job) {
    console.log("err: ", err);
    console.log("job: ", job);
    if(job) {
      var estimateSet = job.estimateSet
        , i = estimateSet ? estimateSet.length : 0
        , data = {
            "aaData": new Array(),
          };
      while(i--) {
        data.aaData.push([
            estimateSet[i]._id,
            estimateSet[i].name,
            estimateSet[i].finalTotal,
            new Date(estimateSet[i].creationDate).toDateString(),
            estimateSet[i].status
        ]);
      }
      res.json(data);
    }
    else {
      console.log("get all this jobs estimates - Not success");
    }

  });
};