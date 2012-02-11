var crypto = require('crypto')
  , mongoose = require('mongoose')
  , User
  , Customer
  , LoginToken
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
    id : Number,
    firstName : String,
    lastName : String,
    email : String,
    phone1 : String,
    phone2 : String,
    street1 : String,
    street2 : String,
    postal : String,
    city : String,
    province : String,
    country : String,
    registrationDate : Date,
    status : String
  });

  Customer.statics.findAll = function findAll(opt, cb) {
    return this.find({}, cb);
  };

  db.model('User', User);
  db.model('Customer', Customer);

  callback();
}

exports.defineModels = defineModels; 

