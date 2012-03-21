var mongoose = require('mongoose')
  , Job = require('./../models').Job
  , Customer = require('./../models').Customer
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , jobValidator = require('./../validators.js').jobValidator
  , ObjectId = mongoose.Types.ObjectId;

/*
models.defineModels(function(){
  Customer = mongoose.model('Customer');
  Jobs = mongoose.model('Job');
});
*/

exports.generate = function (req, res) {
  console.log("creating test data");

  var customer1 = new Customer();
  var customer2 = new Customer();
  var customer3 = new Customer();
  var customer4 = new Customer();
  var customer5 = new Customer();
  var customer6 = new Customer();

  var job101_1 = new Job();
  var job101_2 = new Job();
  var job101_3 = new Job();
  var job101_4 = new Job();


  var job102_1 = new Job();
  var job102_2 = new Job();


  var job103_1 = new Job();
  var job103_2 = new Job();
  var job103_3 = new Job();
  var job103_4 = new Job();

  var job104_1 = new Job();


  var job105_1 = new Job();

  var job106_1 = new Job();
  var job106_2 = new Job();
  var job106_3 = new Job();
  var job106_4 = new Job();

    customer1.firstName = "Barbara";
    customer1.lastName = "Meyer";
    customer1.email = "Barbarra@email.ca";
    customer1.phone1 = "416-555-1234";
    customer1.address1 = "97 Bremfield Place";
    customer1.postal = "M5B2C9";
    customer1.city = "Toronto";
    customer1.province = "Ontario";
    customer1.country = "Canada";

    customer2.firstName = "Anthony";
    customer2.lastName = "Wu";
    customer2.email = "AnthonyWu@email.ca";
    customer2.phone1 = "905-555-4567";
    customer2.address1 = "187 Skyway Rd";
    customer2.postal = "M6KMK9";
    customer2.city = "Mississuaga";
    customer2.province = "Ontario";
    customer2.country = "Canada";

    customer3.firstName = "Johnen";
    customer3.lastName = "Vasquez";
    customer3.email = "JVasquez@email.ca";
    customer3.phone1 = "416-555-9876";
    customer3.phone2 = "416-555-4545";
    customer3.address1 = "90 Bathurst St";
    customer3.address2 = "88 Dufferin St";
    customer3.postal = "M5D9A5";
    customer3.city = "Toronto";
    customer3.province = "Ontario";
    customer3.country = "Canada";

    customer4.firstName = "Bryan";
    customer4.lastName = "Ramirez";
    customer4.email = "Bram@email.ca";
    customer4.phone1 = "416-555-9595";
    customer4.address1 = "90 Kimberly St";
    customer4.postal = "M8D9C8";
    customer4.city = "Toronto";
    customer4.province = "Ontario";
    customer4.country = "Canada";

    customer5.firstName = "Gerald";
    customer5.lastName = "Fitzpatrick";
    customer5.email = "Fritz@email.ca";
    customer5.phone1 = "416-555-2112";
    customer5.address1 = "50 Eglinton West";
    customer5.postal = "M5K7E9";
    customer5.city = "Toronto";
    customer5.province = "Ontario";
    customer5.country = "Canada";

    customer6.firstName = "Samantha";
    customer6.lastName = "Mathews";
    customer6.email = "Sammy123@email.ca";
    customer6.phone1 = "416-555-4117";
    customer6.phone2 = "416-555-9021";
    customer6.address1 = "20 Dundas West";
    customer6.address2 = "85 Woodbine Ave";
    customer6.postal = "M9D2K9";
    customer6.city = "Toronto";
    customer6.province = "Ontario";
    customer6.country = "Canada";



    job101_1.name = "Front Door"
    job101_1.description = "Full replacement of broken front door"
    job101_1.status = "Closed"
    job101_1.customerID = 101


    job101_2.name = "Bedroom"
    job101_2.description = "installation of new bedroom door"
    job101_2.status = "Closed"
    job101_2.customerID = 101


    job101_3.name = "Kitchen"
    job101_3.description = "replacement of kitchen window"
    job101_3.customerID = 101


    job101_4.name = "Back Door"
    job101_4.description = "replacement of broken back door"
    job101_4.customerID = 101


    job102_1.name = "Attic"
    job102_1.description = "replacement of old attic window"
    job102_1.status = "Closed"
    job102_1.customerID = 102


    job102_2.name = "Basement Bedroom"
    job102_2.description = "installation of new basement bedroom window"
    job102_2.customerID = 102


    job103_1.name = "Bathroom"
    job103_1.description = "replacement of bathroom window"
    job103_1.status = "Closed"
    job103_1.customerID = 103


    job103_2.name = "Kitchen"
    job103_2.description = "new installation of kitchen window"
    job103_2.status = "Closed"
    job103_2.customerID = 103


    job103_3.name = "childrens room"
    job103_3.description = "replacement of children's bedroom door"
    job103_3.status = "Closed"
    job103_3.customerID = 103


    job103_4.name = "Basement Bathroom"
    job103_4.description = "replacement of broken basement bathroom window"
    job103_4.customerID = 103


    job104_1.name = "Kitchen"
    job104_1.description = "replacement of broken kitchen window"
    job104_1.customerID = 104


    job105_1.name = "Patio"
    job105_1.description = "installation of new patio door"
    job105_1.customerID = 105


    job106_1.name = "Bedroom1"
    job106_1.description = "installation of new bedroom window"
    job106_1.status = "Closed"
    job106_1.customerID = 106


    job106_2.name = "guest bedroom"
    job106_2.description = "replacement of old door in guest bedroom"
    job106_2.status = "Closed"
    job106_2.customerID = 106


    job106_3.name = "Bathroom"
    job106_3.description = "installation of new bathroom door"
    job106_3.customerID = 106


    job106_4.name = "Dining Room"
    job106_4.description = "replacement of broken dining room window"
    job106_4.customerID = 106



    console.log("Creating test customer accounts");

    customer1.save(function(err) {
      if (err){
        console.log("err: " + err);
        return customerAddFailed();
      }
      console.log("Adding customer1 SUCCEED");
    });

    customer2.save(function(err) {
      if (err){
        console.log("err: " + err);
        return customerAddFailed();
      }
      console.log("Adding customer2 SUCCEED");
    });

    customer3.save(function(err) {
      if (err){
        console.log("err: " + err);
        return customerAddFailed();
      }
      console.log("Adding customer3 SUCCEED");
    });

    customer4.save(function(err) {
      if (err){
        console.log("err: " + err);
        return customerAddFailed();
      }
      console.log("Adding customer4 SUCCEED");
    });

    customer5.save(function(err) {
      if (err){
        console.log("err: " + err);
        return customerAddFailed();
      }
      console.log("Adding customer5 SUCCEED");
    });


    customer6.save(function(err) {
      if (err){
        console.log("err: " + err);
        return customerAddFailed();
      }
      console.log("Adding customer6 SUCCEED");
    });


    console.log("Creating jobs for the test customers");


    job101_1.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 1 for customer1 SUCCEED");
    });


    job101_2.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 2 for customer1 SUCCEED");
    });


    job101_3.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 3 for customer1 SUCCEED");
    });

    job101_4.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 4 for customer1 SUCCEED");
    });



    job102_1.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 1 for customer2 SUCCEED");
    });


    job102_2.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 2 for customer2 SUCCEED");
    });




    job103_1.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 1 for customer3 SUCCEED");
    });


    job103_2.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 2 for customer3 SUCCEED");
    });


    job103_3.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 3 for customer3 SUCCEED");
    });

    job103_4.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 4 for customer3 SUCCEED");
    });


    job104_1.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 1 for customer4 SUCCEED");
    });


    job105_1.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 1 for customer5 SUCCEED");
    });


    job106_1.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 1 for customer6 SUCCEED");
    });


    job106_2.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 2 for customer6 SUCCEED");
    });


    job106_3.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 3 for customer6 SUCCEED");
    });

    job106_4.save(function(err) {
      if (err){
        console.log("err: " + err);
        //return jobAddFailed();
      }
      console.log("Adding job 4 for customer6 SUCCEED");
    });

      
      res.redirect('/customers');
};



