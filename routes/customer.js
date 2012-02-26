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
    console.log("add customer FAIL");
    //req.flash('addError', 'Customer Add failed');
    res.render('customer/customers', 
    {
      layout: 'includes/layout',
      title: 'Customer'
    });
  };

  Customer.count({}, function (err, count) {
    customer.id = count + 1;
    customer.save(function(err) {
      if (err){
        console.log("err: " + err);
        return customerAddFailed();
      }
      console.log("Adding SUCCEED");
      //req.flash('info', 'The customer has been added');
      res.redirect('/customers');
    });
  });
};

exports.edit = function (req, res) {
  console.log("edit customer route");
  var formCustomer = new Customer(req.body.cust);
  //console.log("customer: %o", req.body.cust);
  function customerEditFailed() {
    console.log("edit customer FAIL");
    //req.flash('addError', 'Customer Add failed');
    res.render('customer/custDetails/', 
    {
      layout: 'includes/layout',
      title: 'Customer',
      customer: formCustomer
    });
  };

  Customer.findOne({id:formCustomer.id}, function(err, customer) {
    if(customer){
      customer.firstName = formCustomer.firstName;
      customer.lastName = formCustomer.lastName;
      customer.email = formCustomer.email;
      customer.phone1 = formCustomer.phone1;
      customer.phone2 = formCustomer.phone2;
      customer.address1 = formCustomer.address1;
      customer.address2 = formCustomer.address2;
      customer.postal = formCustomer.postal;
      customer.city = formCustomer.city;
      customer.province = formCustomer.province;
      customer.country = formCustomer.country;
      //customer.registrationDate = formCustomer.registrationDate;
      //customer.status = formCustomer.status;
      customer.save(function(err) {
        if (err){
          console.log("err: " + err);
          return customerEditFailed();
        }
        console.log("Editing SUCCEED");
        //req.flash('info', 'The customer has been added');
        res.redirect('/customer/' + customer.id);
      });
    }else{
      console.log("Customer not found. This shouldn't happen");
      res.render('customer/custDetails/', 
      {
        layout: 'includes/layout',
        title: 'Customer',
        customer: formCustomer
      });
    }
  });
};

exports.details = function (req, res) {
  console.log("customer details route");
  console.log("customer ID: " + req.params.id);

  Customer.findOne({id:req.params.id}, function (err, customer) {
    if(!customer){
      console.log("get specific customer not successful");
    }else{
      res.render('customer/custDetails', 
        {
          layout: 'includes/layout',
          title: 'Customer',
          customer: customer
        }
      );
    }
  });  
};
