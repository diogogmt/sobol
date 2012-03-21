var crypto = require('crypto')
  , mongoose = require('mongoose')
  , config = require('./config')
  , gridfs = require("./gridfs")
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


// List of schemas
var schemas = {
  "user": null,
  "customer": null,
  "note": null,
  "job": null,
  "estimate": null,
  "lineItem": null,
  "media": null,
}

// Database connection
var db = mongoose.connect(config.mongo.connectionString);

/**
* User schema
*/
exports.User = (function () {
  schemas.user = new Schema({
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

  schemas.user.virtual('password')
    .set(function(password) {
      // TODO
      // validate password here
      this.hashed_password = this.encryptPassword(password);
    });

  schemas.user.method('authenticate', function(plainText) {
    // console.log("user authenticate");
    // console.log("password: ", plainText);
    // console.log("hashed_password: ", this.hashed_password);
    // console.log("encryptPassword: ", this.encryptPassword(plainText));
    return this.encryptPassword(plainText) === this.hashed_password;
  });


  schemas.user.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', config.salt).update(password).digest('hex');
  });

  schemas.user.pre('save', function(next) {
    //TODO
    //validate object before saving it
    next();
  });

  return db.model('User', schemas.user);
})();



/**
* Media schema
*/
exports.Media = (function () {
  schemas.media = new Schema({
    'name' : String,
    'desc' : String,
    'src' : ObjectId,
    'thumbnail' : ObjectId,
    'tags' : [String]
  });

  return db.model('Media', schemas.media);
})();


/**
* Note schema
*/
exports.Note = (function () {
 schemas.note = new Schema({
    'noteText' : String,
    'creationDate' : { type: Date, default: Date.now },
  });

  return db.model('Note', schemas.note);
})();


/**
* Customer schema
*/
exports.Customer = (function () {
  schemas.customer = new mongoose.Schema({
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
    'noteSet' : [schemas.note]
  });

  schemas.customer.virtual('tel1a');
  schemas.customer.virtual('tel1b');
  schemas.customer.virtual('tel1c');
  schemas.customer.virtual('tel2a');
  schemas.customer.virtual('tel2b');
  schemas.customer.virtual('tel2c');

  return db.model('Customer', schemas.customer);
})();


/**
<<<<<<< HEAD
* Line Item schema
=======
* Model: Job
*/
exports.Job = (function () {
  //console.log("Job model");

 Job = new Schema({
    'name' : String,
    'description' : String,
    'PID' : { type: Number, default: 0 },
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
>>>>>>> remotes/DennisRepo/master
*/
exports.EstimateLineItem = (function () {
 schemas.lineItem = new Schema({
    'name' : String,
    'description' : String,
    'quantity' : Number,
    'cost' : Number
    //'media' : ObjectId
  });

  return db.model('EstimateLineItem', schemas.lineItem);
})();


/**
* Estimate schema
*/
exports.Estimate = (function () {
 schemas.estimate = new Schema({
    'name' : String,
    'quoteID' : Number,
    'subTotal' : Number,
    'finalTotal' : Number,
    'creationDate' : { type: Date, default: Date.now },
    'status' : { type: String, default: "Active" },
    'lineItemSet' : [schemas.lineItem]
  });

  return db.model('Estimate', schemas.estimate);
})();


/**
* Job schema
*/
<<<<<<< HEAD
exports.Job = (function () {
 schemas.job = new Schema({
    'name' : String,
    'description' : String,
    'creationDate' : { type: Date, default: Date.now },
    'status' : { type: String, default: "Active" },
    'scheduledDates' : [Date],
    'customerID' : ObjectId,
    'estimateSet' : [schemas.estimate]
=======
exports.Note = (function () {
  //console.log("Note model");

 Note = new Schema({
    'noteText' : String,
    'LastModifiedDate' : { type: Date, default: Date.now },
>>>>>>> remotes/DennisRepo/master
  });

  return db.model('Job', schemas.job);
})();
