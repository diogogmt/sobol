var mongoose = require('mongoose')
  , models = require('./../models')
  , Customer = require('./../models').Customer
  , Job = require('./../models').Job
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , customerValidator = require('./../validators.js').customerValidator
  , ObjectId = mongoose.Types.ObjectId;


exports.all = function (req, res) {
  // console.log("all customers route");
  // console.log("req.currentUser: %o", req.currentUser);
  res.render('customer/customers', 
    {
      layout: 'includes/layout',
      title: 'Customer',
      errors: false
    });
};

exports.findAll = function (req, res) {
  //console.log("all customers route");
  //console.log("req.currentUser: %o", req.currentUser);

  Customer.find({}, function (err, customers) {
    //console.log("customer callback");
    if(customers){
      //console.log("get all customers success");
      //console.log(customers);

      var dataSet = new Array();
      var innerCust = customers;
      for(i = 0; i < customers.length; i++){
        // console.log("This is CUSTOMERS: " + customers);
        // console.log("This is INNER CUST: " + innerCust);
        //console.log("count: " + i);
        var countJob = function (i) {
          Job.count({ customerID : customers[i]._id }, function (err, count) {
            //console.log("inside count: " + i);
            dataSet.push([
              innerCust[i]._id,
              innerCust[i].lastName,
              innerCust[i].firstName,
              innerCust[i].email,
              innerCust[i].phone1,
              count,
              new Date(innerCust[i].registrationDate).toDateString(),
              innerCust[i].status
            ]);

            //console.log("INNER CUST LENGTH: " + innerCust.length);
            if(i == innerCust.length - 1){
              var aaData = {
                "aaData" : dataSet
              };

              res.json(aaData);
            }
          }); // END JOB COUNT
        }(i); // END countJob
      } // END for loop
    }
    else
    {
      console.log("get all customers Not success");
    }
  });
};


exports.add = function (req, res) {
  //console.log("add customer route");
  var customer = new Customer(req.body.cust);
  //console.log("customer: %o", req.body.cust);
  function customerAddFailed() {
    console.log("add customer FAIL");
    //req.flash('addError', 'Customer Add failed');
    res.render('customer/customers',
    {
      layout: 'includes/layout',
      title: 'Customer',
      errors: false
    });
  };

  customer.save(function(err) {
    if (err){
      console.log("err: " + err);
      return customerAddFailed();
    }
    //console.log("Adding SUCCEED");
    //req.flash('info', 'The customer has been added');
    res.redirect('/customers');
  });
};

exports.edit = function (req, res) {
  //console.log("edit customer route");
  var formCustomer = req.body.cust;
  //console.log("customer: %o", req.body.cust);
  function customerEditFailed() {
    console.log("edit customer FAIL");
    //req.flash('addError', 'Customer Add failed');
    res.render('customer/custDetails/',
    {
      layout: 'includes/layout',
      title: 'Customer',
      customer: formCustomer,
      errors: false
    });
  };

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
                    }
  ;
  Customer.update(conditions, update, function (err, numAffected) {
    if (err || numAffected == 0){
      console.log("err: " + err);
      return customerEditFailed();
    }
    //console.log("Editing SUCCEED");
    //req.flash('info', 'The customer has been added');
    res.redirect('/customer/' + formCustomer.id);
  });
};

exports.details = function (req, res) {
  //console.log("customer details route");
  Customer.findOne({ _id : new ObjectId(req.params.id) }, function (err, customer) {
    if(!customer){
      console.log("get specific customer not successful");
    }else{

      var breadcrumb = {
        cust : {
          id : customer._id,
          name : customer.firstName + " " + customer.lastName
        }
      }
      req.session.breadcrumb = breadcrumb;

      res.render('customer/custDetails',
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



exports.findActive = function (req, res) {
  //console.log("all customers route");
  //console.log("req.currentUser: %o", req.currentUser);

  Customer.find({ status : "Active"}, function (err, customers) {
    //console.log("customer callback");
    if(customers){
      //console.log("get all customers success");
      //console.log(customers);

      var dataSet = new Array();
      var innerCust = customers;
      for(i = 0; i < customers.length; i++){
        // console.log("This is CUSTOMERS: " + customers);
        // console.log("This is INNER CUST: " + innerCust);
        //console.log("count: " + i);
        var countJob = function (i) {
          Job.count({ customerID : customers[i]._id }, function (err, count) {
            
            //console.log("inside count: " + i);
            dataSet.push([
              innerCust[i]._id,
              innerCust[i].lastName,
              innerCust[i].firstName,
              innerCust[i].email,
              innerCust[i].phone1,
              count,
              new Date(innerCust[i].registrationDate).toDateString(),
              innerCust[i].status
            ]);

            //console.log("INNER CUST LENGTH: " + innerCust.length);
            if(i == innerCust.length - 1){
              var aaData = {
                "aaData" : dataSet
              };

              res.json(aaData);
            }
          }); // END JOB COUNT
        }(i); // END countJob
      } // END for loop
    }
    else {
      console.log("get all customers Not success");
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
      res.render('customer/customers',
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
      res.render('customer/custDetails',
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

