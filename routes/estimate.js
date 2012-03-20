var mongoose = require('mongoose')
  , models = require('./../models')
  , Estimate = require('./../models').Estimate
  , Job = require('./../models').Job
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , ObjectId = mongoose.Types.ObjectId;

exports.add = function (req, res) {
  //console.log("add estimate route");
  var estimate = new Estimate(req.body.estimate);
  var estimateCount = 0;
  //*****************
  // Get total number of estimates for all the jobs in the system 
     Job.find({}, function (err, jobs) {
      for(i = 0; i < jobs.length; i++){
        estimateCount = estimateCount + jobs[i].estimateSet.length;
      } 
      estimate.quoteID = estimateCount + 1;
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
  //*****************
      var getCustomerName = function (i) {
        Job.findOne({ _id : new ObjectId(req.params.id) }, function (err, job) {
          if(job){
            var estimateSet = job.estimateSet;
            //console.log("Pushing Estimate into Job EstimateSet: ", estimate);
            estimateSet.push(estimate);
            job.save(function(err) {
              if(err){
                console.log("Error saving job after adding estimate");
                return estimateAddFailed();
              }
              //console.log("Adding Estimate SUCCESS");
              //req.flash('info', 'The estimate has been added');
              res.redirect('/job/' + jobID);
            });
          }else{
            console.log("finding job for add estimate - Not success");
            return estimateAddFailed();
          }
        });        
      }(estimate)
  //*****************
     });   
  /*
  Self-Note (Raffi) - Try this instead at some point:
  Customer.update( {_id: custID }, { $push: {estimateSet: newEstimate})
  */
};

exports.edit = function (req, res) {
  //console.log("edit estimate route");
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
  Job.findOne({ _id : new ObjectId(req.params.jobId) }, function (err, job) {
    if(!job){
      console.log("get specific job for estimate not successful");
    }else{
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
        //console.log("This is the passed Estimate: ", estimate);
        var breadcrumb = req.session.breadcrumb;
        breadcrumb.estimate = {
          id : estimate._id,
          name : estimate.name
        }
        res.render('estimate/estimateDetails', 
        {
          layout: 'includes/layout',
          title: 'Estimate',
          estimate: estimate,
          jobID: req.params.jobId,
          breadcrumb: breadcrumb
        });
      }else{
        console.log("No estimates found for this job. This shouldn't be possible");
      }
    }
  });  
};

exports.getJobEstimates = function (req, res) {
  Job.findOne({ _id : new ObjectId(req.params.id) }, function (err, job) {
    //console.log("The current customer is " + req.params.id);
    if(job){
      //console.log("Get specific job for estimates list - SUCCESS");
      var dataSet = new Array();
      var estimates = job.estimateSet;
      for(i = 0; i < estimates.length; i++){
        dataSet.push([
            estimates[i]._id,
            estimates[i].name,
            estimates[i].finalTotal,
            new Date(estimates[i].creationDate).toDateString(),
            estimates[i].status
        ]);
      }
      var aaData = {
        "aaData" : dataSet
      };
      res.json(aaData);
    }
    else 
    {
      console.log("get all this jobs estimates - Not success");
    }
  });
};