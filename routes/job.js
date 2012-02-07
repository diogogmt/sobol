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
};


exports.add = function(req, res) {
  console.log("add job route");
//  var job = new Job(req.body.job);
  console.log("job: %o", job);
  function jobSaveFailed() {
    console.log("failed creating job");
// need to confirm if we need to redirect to customers or job
  }

  job.save(function(err) {
    if (err) {
      console.log("err: " + err);
      return jobSaveFailed();
    } 
    console.log("creating job");
  //  req.flash('info', 'Job has been added');
  });
};

exports.findAll = function (req, res) {
  console.log("all customers route");
};




/*
exports.all = function (req, res) {
  console.log("all jobs route");
  return 1;
};

exports.add = function(req, res) {
  console.log("add job route");
  return 1;
};

exports.findAll = function (req, res) {
  console.log("all customers route");
  return 1;
};

*/
