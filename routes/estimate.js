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
  console.log("req.body: ", req.body);
  var estimate = new Estimate(req.body.estimate);
  var jobId = new ObjectId(req.params.id);

  console.log("jobId: ", jobId);
  console.log("estimate: ", estimate);


  Job.update(
    { "_id": jobId },
    { $push: {"estimateSet": estimate} },
    { upsert: false, safe:true },
      function (err) {
        if (err) {
          // TODO implement ASSERTIONS. Look at how firefox does ASSERTIONS
          console.log("error adding estimate to job: ", err);
        }
        res.send();
      });
};

exports.edit = function (req, res) {
  console.log("edit estimate route");
  var formEstimate = req.body.formEstimate;
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

  Job.findOne({ "estimateSet._id" : new ObjectId(formEstimate.id) }, function (err, job) {
    if(job){
      var estimateSet = job.estimateSet;
      var pid = job.PID;
      var jobID = job._id;
      for(var i = 0; i < estimateSet.length; i++){
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
          var conditions  = { "estimateSet._id" : new ObjectId(formEstimate.id) }
            , update      = { estimateSet : estimateSet
                            , PID : pid }
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

