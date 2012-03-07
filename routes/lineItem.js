var mongoose = require('mongoose')
  , models = require('./../models')
  , EstimateLineItem = require('./../models').EstimateLineItem
  , Estimate = require('./../models').Estimate
  , Job = require('./../models').Job
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , ObjectId = mongoose.Types.ObjectId;

exports.add = function (req, res) {
  var lineItem = new EstimateLineItem(req.body.lineItem);
  var estimateID = new ObjectId(req.params.estimateId);
  var jobID = new ObjectId(req.params.jobId);
  function lineItemAddFailed() {
    console.log("add line item FAIL");
    //req.flash('addError', 'Estimate Add failed');
    res.render('estimate/estimateDetails', 
    {
      layout: 'includes/layout',
      title: 'Estimate'
    });
  };

  Job.update({ 'estimateSet._id' : estimateID }, { $push : { 'estimateSet[0].lineItemSet' : lineItem }}, function (err){
    if(err){
      console.log("Error adding estimate line item");
      console.log(err);
      return lineItemAddFailed();
    }
    res.redirect('/job/' + jobID + '/estimate/' + estimateID);
  });

  // Job.findOne({ _id : jobID }, function (err, job) {
  //   if(job){
  //     var estimateSet = job.estimateSet;
  //     var estimate;

  //     for(var i = 0; i < estimateSet.length; i++){
  //       // console.log("Found estimate: ", estimateSet[i]);
  //       // console.log("Comparing against ID: " + req.params.estimateId);
  //       if(estimateSet[i]._id == req.params.estimateId){
  //         estimate = estimateSet[i];
  //         break;
  //       }
  //     }

  //     estimate.lineItemSet.push(lineItem);

  //      console.log(job);
  //      console.log(job.estimateSet[0]);
  //     // console.log(job.estimateSet[0].lineItemSet);
  //     // console.log(job.estimateSet[0].lineItemSet[0]);

  //     job.save(function(err) {
  //       if(err){
  //         console.log("Error saving job after adding estimate");
  //         return lineItemAddFailed();
  //       }
  //       //req.flash('info', 'The estimate has been added');
  //       res.redirect('/job/' + jobID + '/estimate/' + estimateID);
  //     });
  //   }else{
  //     console.log("finding job for add estimate - Not success");
  //     return lineItemAddFailed();
  //   }
  // });
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
      for(var i = 0; i < estimateSet.length; i++){
        if(estimateSet[i]._id == formEstimate.id){
          estimateSet[i].name = formEstimate.name;
          var conditions  = { _id : new ObjectId(jobID) }
            , update      = { estimateSet : estimateSet }
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
          breadcrumb: breadcrumb
        });
      }else{
        console.log("No estimates found for this job. This shouldn't be possible");
      }
    }
  });  
};

exports.getLineItems = function (req, res) {
  Job.findOne({ _id : new ObjectId(req.params.jobId) }, function (err, job) {
    if(job){
      var dataSet = new Array();
      var estimate;
      var estimates = job.estimateSet;
      for(var i = 0; i < estimates.length; i++){
        if(estimates[i]._id == req.params.estimateId){
          estimate = estimates[i];
          break;
        }
      }

      var lineItems = estimate.lineItemSet;
      for(var i = 0; i < lineItems; i++){
        dataSet.push([
            lineItems[i]._id,
            lineItems[i].name,
            lineItems[i].description,
            lineItems[i].quantity,
            lineItems[i].cost
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