var crypto = require('crypto')
  , mongoose = require('mongoose')
  , User
  , Customer
  , LoginToken
  , Job
  , config = require('./config')
  db = mongoose.connect(config.mongo.connectionString);


function defineModels(callback) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;


  /**
    * Model: User
    */

  // Add the validation bits when defining the schema
  // TODO
  // Add validation to username email
  User = new Schema({
    'id': Number,
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
    console.log("user authenticate");
    console.log("password: ", plainText);
    console.log("hashed_password: ", this.hashed_password);
    console.log("encryptPassword: ", this.encryptPassword(plainText));
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



  /**
    * Model: Customer
    */
  
  Customer = new Schema({
    'id' : Number,
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
    'status' : { type: String, default: "Active" }
  });

  Customer.virtual('tel1a');
  Customer.virtual('tel1b');
  Customer.virtual('tel1c');
  Customer.virtual('tel2a');
  Customer.virtual('tel2b');
  Customer.virtual('tel2c');

  /**
    * Model: Tag
    */
  
  Tag = new Schema({
    'id' : Number,
    'name' : String
  });

  /**
    * Model: Media
    */
  
  Media = new Schema({
    'id' : Number,
    'name' : String,
    'desc' : String,
    'src' : String,
    'tags' : [Tag]
  });


 Job = new Schema({
    id : Number,
    customid : String,  //assuming that Archie is going to use a mix of char and numerics in his ID's
    name : String,
    description : String,
    creationDate : String,
    status : String,
    scheduleDates : String,
    customerID: Number
  });

  
  db.model('User', User);
  db.model('Customer', Customer);
  db.model('Tag', Tag);
  db.model('Media', Media);
  db.model('Job', Job);

  callback();
}

exports.defineModels = defineModels; 

