var mongoose = require('mongoose')
  , models = require('./../models')
  , EstimateLineItem = require('./../models').EstimateLineItem
  , Estimate = require('./../models').Estimate
  , Job = require('./../models').Job
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , ObjectId = mongoose.Types.ObjectId
  , schemaObjectId = Schema.ObjectId;


exports.add = function (req, res) {
  var body = req.body
    , estimateID = new ObjectId(body.estimateID)
    , lineItem = new EstimateLineItem(req.body.lineItem);

  Job.update(
    {estimateSet: {"$elemMatch": {_id: estimateID}}},
    {$push:
      {
        "estimateSet.$.lineItemSet":
        {
          'name' : lineItem.name,
          'description' : lineItem.description,
          'quantity' : parseInt(lineItem.quantity),
          'cost' : parseInt(lineItem.cost),
          '_id': lineItem._id
        }
      }
    },
    {upsert:false,safe:true},
    function (err) {
      console.log("err: ", err);
      if (err) {
        res.send({
          "err": true,
        });
      }
      else {
        res.send({
          "err": false,
        })
      }
    }
  );
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

