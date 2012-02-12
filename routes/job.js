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



  var now = new Date();
  var day = now.getUTCDate();
  console.log("day is " + day);
  var month = now.getUTCMonth();
  console.log("month is " + month);
  var year = now.getUTCFullYear();
  console.log("year is " + year);
  var today = '' + month + '/' + day + '/' + year;

console.log("today is " + today);

  var job = new Job(req.body.job);
  job.status = "Active";
  job.creationDate = today;
  job.customerID = 1; //the current customer id

 

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
    res.redirect('/customers');
//    req.flash('info', 'Job has been added');
  });

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