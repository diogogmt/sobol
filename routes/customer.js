/*
 * GET home page.
 */

var config = require('./../config');

exports.all = function (req, res) {
  console.log("all customers route");
  console.log("req.currentUser: %o", req.currentUser);
  res.render('customer/customers', 
    {
      layout: 'includes/layout',
      title: 'Customer'
    }
  );
};

var mongoose = require('mongoose')
  , models = require('./../models')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema;

models.defineModels(function(){
  Customer = mongoose.model('Customer');
});

exports.findAll = function (req, res) {
  console.log("all customers route");
  console.log("req.currentUser: %o", req.currentUser);

  Customer.findAll({}, function (err, customers) {
    console.log("customer callback");
    if(customers){
      console.log("success");
      console.log(customers);

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
      console.log("Not success");
    }
  });
}


exports.add = function (req, res) {
  console.log("add customer route");
  res.render('customer/customers', 
    {
      layout: 'includes/layout',
      title: 'Customer'
    }
  );
}
