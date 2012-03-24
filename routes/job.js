var mongoose = require('mongoose')
  , XDate = require('./../xdate.js')
  , Job = require('./../models').Job
  , breadcrumbs = require('./../breadcrumbs')
  , Customer = require('./../models').Customer
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , jobValidator = require('./../validators.js').jobValidator
  , ObjectId = mongoose.Types.ObjectId;

console.log("XDate: ", XDate);

// Jobs List
exports.all = function (req, res) {
  //console.log("all jobs route");
  //console.log("req.currentUser: %o", req.currentUser);
  res.render('job/jobs',
    {
      layout: 'includes/layout',
      title: 'Jobs',
      errors: false
    });
};


// Single Job
exports.details = function (req, res) {
  console.log("job details route");
  console.log("job ID: " + req.params.id);
  var jobId = req.params.id || 0;

  Job.findOne({"_id" : new ObjectId(jobId)}, function (err, job) {
    if (!job) {
      console.log("get specific job not successful");
    }
    else {
      console.log("job found");
      breadcrumbs.createBreadcrumb({ customerID: job.customerID }, function (breadcrumb) {
        console.log("breadcrumb: ", breadcrumb);
        breadcrumb["job"] = {
          id : job._id,
          name : job.name
        };
        console.log("breadcrumb: ", breadcrumb);
        console.log("job.scheduledDates: ", job.scheduledDates);
        var scheduledDates = job.scheduledDates || null
          , i = scheduledDates && scheduledDates.length
          , date
          dates = new Array();

        while (i--) {
          date = new Date(scheduledDates[i]);
          dates.push((date.getMonth() + 1) + "/"
              + date.getDate() + "/" + date.getFullYear());
        }
        // console.log("job.scheduledDates: ", job.scheduledDates);
        // for (var key in job.scheduledDates) {
        //   console.log(job.scheduledDates[key]);
        // }
        // if (job.scheduledDates.length > 0) {
        //   scheduledDates = job.scheduledDates.toString().split(",");
        //   for (var i = 0; i < scheduledDates.length; i++) {
        //     var newDate = new Date(scheduledDates[i]);
        //     scheduledDates[i] = (newDate.getMonth() + 1) + "/"
        //       + newDate.getDate() + "/" + newDate.getFullYear();
        //     console.log(scheduledDates[i]);
        //   }
        // }
        // else {
        //   scheduledDates = "";
        // }
        console.log("dates: ", dates);
        console.log("scheduledDates: ", scheduledDates);
        res.render('job/jobDetails',
          {
            layout: 'includes/layout',
            title: 'Job',
            job: job,
            breadcrumb: breadcrumb,
            dates: dates,
            errors: false
          }
        );
      });
    }
  });
};


exports.add = function(req, res) {
  //console.log("add job route");

  var job = new Job(req.body.job);
  job.customerID = new ObjectId(req.params.id);
  //console.log("job: %o", job);
  function jobSaveFailed() {
    console.log("failed creating job");
    req.session.breadcrumb = breadcrumb;
    res.render('customer/custDetails/',
    {
      layout: 'includes/layout',
      title: 'Customer',
      errors: false,
      breadcrumb: breadcrumb,
    });
  }

  job.save(function(err) {
    if (err) {
      console.log("err: " + err);
      return jobSaveFailed();
    }
    //console.log("creating job");
    res.redirect('/customer/' + job.customerID);
    // req.flash('info', 'Job has been added');
  });
};


exports.edit = function (req, res) {
  //console.log("edit job route");
  var formJob = req.body.formJob;
  function jobEditFailed() {
    console.log("edit job FAIL");
    res.render('job/jobDetails',
    {
      layout: 'includes/layout',
      title: 'Job',
      job: formJob,
      errors: false
    });
  };

  var scheduledDatesArray;
  if(formJob.scheduledDates.length > 0){
    scheduledDatesArray = formJob.scheduledDates.split(",");
  }else{
    scheduledDatesArray = new Array();
  }
  console.log("The scheduled dates array on editing is: ", scheduledDatesArray)
  var conditions = { _id : new ObjectId(formJob.id) }
    , update = { name : formJob.name
               , description : formJob.description
               , scheduledDates : scheduledDatesArray
               , status : formJob.status
               }
  ;
  Job.update(conditions, update, function (err, numAffected) {
    if(err || numAffected == 0){
      console.log("err: " + err);
      return jobEditFailed();
    }
    //console.log("Editing SUCCEED");
    res.redirect('/job/' + formJob.id);
  });
};

exports.calendar = function (req, res) {
  res.render('job/jobsCalendar',
    {
      layout: 'includes/layout',
      title: 'Jobs',
      errors: false
    });
};

// SELF NOTE (RAFFI) - CHANGE TO ONLY FIND ACTIVE JOBS
exports.calendarData = function (req, res) {
  console.log("Entering calendar data route");
  Job.find({}, function (err, jobs) {
    var events = new Array()
      , i = (jobs && jobs.length) || 0
      , j
      , d1
      , d2
      , end
      , job
      , dates;

    while (i--) {
      j = (jobs[i].scheduledDates && jobs[i].scheduledDates.length) || 0;
      end = j-1;
      job = jobs[i];
      while (j--) {
        dates = job.scheduledDates;
        d1 = new XDate(dates[j]).addDays(-1);
          d2 = !!j ? new XDate(dates[j-1]) : d1;
          if (d1.diffDays(d2) || !j) {
            events.push({
              title : job.name,
              start: dates[j],
              end: dates[end],
              url: "/job/" + job._id,
            });
            end = j - 1;
          }
        }
      }
    res.json(events);
  });
};


exports.getCustJobs = function (req, res) {
  Job.find({ customerID : new ObjectId(req.params.id) }, function (err, jobs) {
    //console.log("The current customer is " + req.params.id);
    if(jobs){
      //console.log("get all this customers jobs success: " + jobs.length);
      var dataSet = new Array();
      for(i = 0; i < jobs.length; i++){
        dataSet.push([
            jobs[i]._id,
            jobs[i].name,
            jobs[i].description,
            jobs[i].estimateSet.length,
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


exports.findAll = function (req, res) {
  //console.log("all jobs route");
  Job.find({}, function (err, jobs) {
    //console.log("Find Job ");
    if(jobs){
      //console.log("get all jobs success");
      var dataSet = new Array();
      var innerJobs = jobs;
      for(i = 0; i < jobs.length; i++){

        var getCustomerName = function (i) {
          Customer.findOne({ _id : jobs[i].customerID }, function (err, customer) {
            if(!customer){
              customerName = "Undefined: Orphan Job"
              console.log("customer is ", customerName);
            }else{
              customerName = customer.firstName + ", "  +  customer.lastName;
              console.log("customer is ", customerName);
            }
            console.log("inner jobs are ", innerJobs[i].name);
            dataSet.push([
              innerJobs[i]._id,
              innerJobs[i].name,
              innerJobs[i].description,
              innerJobs[i].creationDate,
              innerJobs[i].status,
              customerName
            ]);
            if(i == innerJobs.length - 1){
              var aaData = {
                "aaData" : dataSet
              };

              res.json(aaData);
            }
          })
        }(i);
      }
    }
    else {
      console.log("get all jobs Not success");
    }
  });
};



exports.validateJob = function (req, res, next) {
  console.log("validating the job");
  var job = new Job(req.body.job);

  var errors = jobValidator(req.body.job, function (err) {
    if (Object.keys(err).length) {

     console.log("HAS ERRORS rendering create again");
     Customer.findOne({ _id : new ObjectId(req.params.id) }, function (err, customer){
              var breadcrumb = req.session.breadcrumb;
              res.render('customer/custDetails',
                {
                    layout: 'includes/layout',
                    title: 'Customer',
                    customer: customer,
                    breadcrumb: breadcrumb,
                    errors: false
                }
              );
      });

      return false;
    }
    next();
  });
}


exports.validateEditJob = function (req, res, next) {
  console.log("validating the job");

  var errors = jobValidator(req.body.formJob, function (err) {
    var job = req.body.formJob;
    if (Object.keys(err).length) {
      console.log("HAS ERRORS rendering create again");

      var breadcrumb = req.session.breadcrumb;
      breadcrumb.job = {
        id : job._id,
        name : job.name
      }

      req.session.breadcrumb = breadcrumb;
      res.render('job/jobDetails',
        {
          layout: "includes/layout",
          title: "Job",
          job: req.body.formJob,
          breadcrumb: breadcrumb,
          errors: err
        }
      );
      return false;
    }
    next();
  });
}
