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


// Jobs List
exports.all = function (req, res) {
  res.render('job/list/jobs',
    {
      layout: 'includes/layout',
      title: 'Jobs',
      errors: false
    });
};


// Single Job
exports.details = function (req, res) {
  var jobId = req.params.id || 0;

  Job.findById(new ObjectId(jobId), function (err, job) {
    if (!job) {
      // TODO implement ASSERTIONS. Look at how firefox does ASSERTIONS
      console.log("job shouldn't be NULL");
      // Redirect to 404 page
    }

    breadcrumbs.createBreadcrumb({ customerID: job.customerID }, function (breadcrumb) {
      breadcrumb["job"] = {
        id : job._id,
        name : job.name
      };
      var scheduledDates = job.scheduledDates || null
        , i = scheduledDates && scheduledDates.length
        , date
        dates = new Array();

      while (i--) {
        date = new Date(scheduledDates[i]);
        dates.push((date.getMonth() + 1) + "/"
            + date.getDate() + "/" + date.getFullYear());
      }
      res.render('job/single/job',
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
  });
};


// Create new job
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


// Edit a job
exports.edit = function (req, res) {
  var jobId = req.params.id || 0;
  var job = req.body.job;

  Job.update(
    {"_id" : new ObjectId(jobId) },
    {
      "name" : job.name,
      "description" : job.description,
      "scheduledDates" : job.scheduledDates,
      "status" : job.status
    },
    function (err, numAffected) {
      if(err || !numAffected){
        // TODO: create log module
        console.log("numAffected: ", numAffected);
        console.log("job should have been updated, err: ", err);
      }
      res.send();
  });
};



/**
  * Calendar
  */
exports.calendar = function (req, res) {
  res.render('job/calendar/jobsCalendar',
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
        // if j equals to 0 assign current date to d2
        d2 = !!j ? new XDate(dates[j-1]) : d1;
        // if the days are different or j is equal to 0 , push to the eventsSet
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
      res.render('job/single/jobDetails',
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