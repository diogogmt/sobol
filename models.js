var crypto = require('crypto')
  , mongoose = require('mongoose')
  , User
  , Customer
  , LoginToken
  , Job
  , EstimateLineItem
  , Estimate
  , Note
  , config = require('./config')
  , gridfs = require("./gridfs")
  , db = mongoose.connect(config.mongo.connectionString)
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

//console.log("model.js");

/**
* Model: User
*/
exports.User = (function () {
  //console.log("User model");
  User = new Schema({
    'username': {
      type: String,
      index: { unique: true }
    },
    'email': {
      type: String,
      index: { unique: true }
    },
    'hashed_password': String
  });

  User.virtual('password')
    .set(function(password) {
      // TODO
      // validate password here
      this.hashed_password = this.encryptPassword(password);
    });

  User.method('authenticate', function(plainText) {
    // console.log("user authenticate");
    // console.log("password: ", plainText);
    // console.log("hashed_password: ", this.hashed_password);
    // console.log("encryptPassword: ", this.encryptPassword(plainText));
    return this.encryptPassword(plainText) === this.hashed_password;
  });


  User.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', config.salt).update(password).digest('hex');
  });

  User.pre('save', function(next) {
    //TODO
    //validate object before saving it
    next();
  });

  return db.model('User', User);
})();


/**
* Model: Tag
*/
exports.Tag = (function () {
  //console.log("Tag model");
  Tag = new Schema({
    'name' : String
  });

  return db.model('Tag', Tag);
})();

/**
* Model: Media
*/
exports.Media = (function () {
  //console.log("Media model");
  Media = new Schema({
    'name' : String,
    'desc' : String,
    'src' : ObjectId,
    'thumbnail' : ObjectId,
    'tags' : [String]
  });

  return db.model('Media', Media);
})();


/**
* Model: Customer
*/
exports.Customer = (function () {
  //console.log("Customer model");
  Customer = new mongoose.Schema({
    'firstName' : String,
    'lastName' : String,
    'email' : String,
    'phone1' : String,
    'phone2' : String,
    'address1' : String,
    'address2' : String,
    'postal' : String,
    'city' : String,
    'province' : String,
    'country' : String,
    'registrationDate' : { type: Date, default: Date.now },
    'status' : { type: String, default: "Active" },
    'noteSet' : [exports.Note]
  });

  Customer.virtual('tel1a');
  Customer.virtual('tel1b');
  Customer.virtual('tel1c');
  Customer.virtual('tel2a');
  Customer.virtual('tel2b');
  Customer.virtual('tel2c');

  return db.model('Customer', Customer);
})();


/**
* Model: Job
*/
exports.Job = (function () {
  //console.log("Job model");

 Job = new Schema({
    'name' : String,
    'description' : String,
    'creationDate' : { type: Date, default: Date.now },
    'status' : { type: String, default: "Active" },
    'scheduleDates' : String,
    'customerID' : ObjectId,
    'estimateSet' : [exports.Estimate]
  });

  return db.model('Job', Job);
})();

/**
* Model: Estimate Line Item
*/
exports.EstimateLineItem = (function () {
  //console.log("Estimate Line Item model");

 EstimateLineItem = new Schema({
    'name' : String,
    'description' : String,
    'quantity' : Number,
    'cost' : Number
    //'media' : ObjectId
  });

  return db.model('EstimateLineItem', EstimateLineItem);
})();

/**
* Model: Estimate
*/
exports.Estimate = (function () {
  //console.log("Estimate model");

 Estimate = new Schema({
    'name' : String,
    'subTotal' : Number,
    'finalTotal' : Number,
    'creationDate' : { type: Date, default: Date.now },
    'status' : { type: String, default: "Active" },
    'lineItemSet' : [exports.EstimateLineItem]
  });

  return db.model('Estimate', Estimate);
})();

/**
* Model: Note
*/
exports.Note = (function () {
  //console.log("Note model");

 Note = new Schema({
    'noteText' : String,
    'creationDate' : { type: Date, default: Date.now },
  });

  return db.model('Note', Note);
})();

//console.log("exports", exports);
