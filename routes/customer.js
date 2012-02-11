var mongoose = require('mongoose')
  , models = require('./../models')
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema;

models.defineModels(function(){
  Customer = mongoose.model('Customer');
});

exports.all = function (req, res) {
  console.log("all customers route");
  console.log("req.currentUser: %o", req.currentUser);
  res.render('customer/customers', 
    {
      layout: 'includes/layout',
      title: 'Customer'
    });
};

exports.findAll = function (req, res) {
  console.log("all customers route");
  //console.log("req.currentUser: %o", req.currentUser);

  Customer.find({}, function (err, customers) {
    console.log("customer callback");
    if(customers){
      console.log("get all customers success");
      //console.log(customers);

      var dataSet = new Array();
      for(i = 0; i < customers.length; i++){
        dataSet.push([
            customers[i].id,
            customers[i].firstName + ' ' + customers[i].lastName,
            customers[i].email,
            customers[i].phone1,
            0,
            customers[i].status
        ]);
      }

      var aaData = {
        "aaData" : dataSet
      };

      res.json(aaData);
    }
    else {
      console.log("get all customers Not success");
    }
  });
};


exports.add = function (req, res) {
  console.log("add customer route");
  var customer = new Customer(req.body.cust);
  //console.log("customer: %o", req.body.cust);
  function customerAddFailed() {
    console.log("add user FAIL");
    //req.flash('addError', 'Customer Add failed');
    res.render('customer/customers', 
    {
      layout: 'includes/layout',
      title: 'Customer'
    });
  };

  customer.save(function(err) {
    if (err){
      console.log("err: " + err);
      return customerAddFailed();
    }
    console.log("Adding SUCCEED");
    //req.flash('info', 'The customer has been added');
    res.redirect('/customers');
  });
};

exports.details = function (req, res) {
  console.log("customer details route");
  console.log("customer ID: " + req.params.id);
  res.render('customer/custDetails', 
    {
      layout: 'includes/layout',
      title: 'Customer',
      custID: req.params.id
    }
  );
};
