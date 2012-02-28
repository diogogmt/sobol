var mongoose = require('mongoose')
  , models = require('./../models')
  , Customer = require('./../models').Customer
  , Job = require('./../models').Job
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , ObjectId = mongoose.Types.ObjectId;

// models.defineModels(function(){
//   Customer = mongoose.model('Customer');
// });

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

exports.edit = function (req, res) {
  console.log("edit customer route");
  var formCustomer = req.body.cust;
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

  Customer.findOne({ _id : new ObjectId(formCustomer.id) }, function (err, customer) {
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
        res.redirect('/customer/' + customer._id);
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
  //console.log("customer details route");
  Customer.findOne({ _id : new ObjectId(req.params.id) }, function (err, customer) {
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
