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
  console.log("job: %o", job);
  function jobSaveFailed() {
    console.log("failed creating job");
//need to confirm if we need to redirect to customers or job
  }

  job.save(function(err) {
    if (err) {
      console.log("err: " + err);
      return jobSaveFailed();
    } 
    console.log("creating job");
    res.redirect('/customers');
//    req.flash('info', 'Job has been added');
  });
  
};

exports.findAll = function (req, res) {
  console.log("all customers route");

 Job.find({}, function (err, jobs) {
    console.log("Find Job ");
    if(jobs){
      console.log("get all jobs success");
      //console.log(customers);

      var dataSet = new Array();
      for(i = 0; i < jobs.length; i++){
        dataSet.push([
            jobs[i].customid,
            jobs[i].name,
            jobs[i].description
      
        ]);
      }

      res.json(aaData);
    }
    else {
      console.log("get all jobs Not success");
    }
  });



};