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
  console.log("add estimate route");
  var estimate = new Estimate(req.body.estimate);
  function estimateAddFailed() {
    console.log("add estimate FAIL");
    //req.flash('addError', 'Estimate Add failed');
    res.render('job/jobDetails', 
    {
      layout: 'includes/layout',
      title: 'Job'
    });
  };

  estimate.save(function(err) {
    if (err){
      console.log("err: " + err);
      return estimateAddFailed();
    }
    console.log("Adding SUCCEED");
    //req.flash('info', 'The estimate has been added');
    res.redirect('/job/' + job._id);
  });
};

exports.edit = function (req, res) {
  console.log("edit estimate route");
  var formEstimate = req.body.estimate;
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

  /*var conditions  = { _id : new ObjectId(formCustomer.id) }
    , update      = { firstName : formCustomer.firstName
                    , lastName : formCustomer.lastName
                    , email : formCustomer.email
                    , phone1 : formCustomer.phone1
                    , phone2 : formCustomer.phone2
                    , address1 : formCustomer.address1
                    , address2 : formCustomer.address2
                    , postal : formCustomer.postal
                    , city : formCustomer.city
                    , province : formCustomer.province
                    , country : formCustomer.country
                    }
  ;
  Customer.update(conditions, update, function (err, numAffected) {
    if (err || numAffected == 0){
      console.log("err: " + err);
      return customerEditFailed();
    }
    console.log("Editing SUCCEED");
    //req.flash('info', 'The customer has been added');
    res.redirect('/customer/' + formCustomer.id);
  });*/
};

exports.details = function (req, res) {
  Estimate.findOne({ _id : new ObjectId(req.params.id) }, function (err, estimate) {
    if(!estimate){
      console.log("get specific estimate not successful");
    }else{
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

exports.getJobEstimates = function (req, res) {
  Job.findOne({ _id : new ObjectId(req.params.id) }, function (err, job) {
    //console.log("The current customer is " + req.params.id);
    if(job){
      console.log("Get specific job for estimates list - SUCCESS");
      var dataSet = new Array();
      var estimates = job.estimateSet;
      for(i = 0; i < estimates.length; i++){
        dataSet.push([
            estimates[i]._id,
            estimates[i].name,
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
      console.log("get all this jobs estimates - Not success");
    }
  });
};