var mongoose = require('mongoose')
  , models = require('./../models')
  , Customer = require('./../models').Customer
  , Job = require('./../models').Job
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , customerValidator = require('./../validators.js').customerValidator
  , ObjectId = mongoose.Types.ObjectId;


// Customer default page
exports.default = function (req, res) {
  res.render('customer/list/customers',
    {
      layout: 'includes/layout',
      title: 'Customer',
      errors: false
    });
};

// Create new customer
exports.create = function (req, res) {
  var customer = new Customer(req.body.cust);
  customer.save(function(err) {
    if (err) {
      // TODO implement ASSERTIONS. Look at how firefox does ASSERTIONS
      console.log("error saving customer, err: ", err);
      // Redirect to error page
    }
    res.send();
  });
};

exports.edit = function (req, res) {
  //console.log("edit customer route");
  var formCustomer = req.body.cust;

  //console.log("customer: %o", req.body.cust);
  function customerEditFailed() {
    console.log("edit customer FAIL");
    //req.flash('addError', 'Customer Add failed');
    res.render('customer/single/custDetails/',
    {
      layout: 'includes/layout',
      title: 'Customer',
      customer: formCustomer,
      errors: false
    });
  };
  Job.find({ customerID : new ObjectId(formCustomer.id)}, function (err, jobs) {
    var status = formCustomer.status;
      if(jobs){
        for(i = 0; i < jobs.length; i++){
          console.log ("found an", jobs[i].status,  "job");
          if(jobs[i].status == "Active"){
            status = "Active";
          }
        }
      }

    var conditions = { _id : new ObjectId(formCustomer.id) }
      , update = { firstName : formCustomer.firstName
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
                      , status : status
                      };

    Customer.update(conditions, update, function (err, numAffected) {
      if (err || numAffected == 0){
        console.log("err: " + err);
        return customerEditFailed();
      }
      //console.log("Editing SUCCEED");
      //req.flash('info', 'The customer has been added');
      res.redirect('/customer/' + formCustomer.id);
    });
  });
};

exports.details = function (req, res) {
  //console.log("customer details route");
  Customer.findOne({ _id : new ObjectId(req.params.id) }, function (err, customer) {
    if(!customer){
      console.log("get specific customer not successful");
    }
    else{
      var breadcrumb = {
        cust : {
          id : customer._id,
          name : customer.firstName + " " + customer.lastName
        }
      }
      req.session.breadcrumb = breadcrumb;

      res.render('customer/single/custDetails',
        {
          layout: 'includes/layout',
          title: 'Customer',
          customer: customer,
          breadcrumb: breadcrumb,
          errors: false
        }
      );
    }
  });
};


exports.validateCustomer = function (req, res, next) {
  //console.log("validating the customer");
  var errors = customerValidator(req.body.cust, function (err) {
    // console.log('err: ', err);
    // console.log("err.length: ", Object.keys(err).length);
    if (Object.keys(err).length) {
      console.log("HAS ERRORS rendering create again");
      res.render('customer/list/customers',
        { 
          layout: "includes/layout",
          title: "Customer",
          customer: req.body.cust,
          errors: err 
        }
      );
      return false;
      // next(new Error("Validate user error"));
    }
    next();  
  });
  
};


exports.validateEditCustomer = function (req, res, next) {
  //console.log("validating the customer");
  var errors = customerValidator(req.body.cust, function (err) {
  var customer = req.body.cust;
    // console.log('err: ', err);
    // console.log("err.length: ", Object.keys(err).length);
    if (Object.keys(err).length) {
      console.log("HAS ERRORS rendering create again");
      var breadcrumb = {
        cust : {
          id : customer._id,
          name : customer.firstName + " " + customer.lastName
        }
      }
      req.session.breadcrumb = breadcrumb;
      res.render('customer/single/custDetails',
        { 
          layout: "includes/layout",
          title: "Customer",
          customer: req.body.cust,
          breadcrumb: breadcrumb,
          errors: err 
        }
      );
      return false;
      // next(new Error("Validate user error"));
    }
    next();  
  });
  
};

