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
  function validatePresenceOf(value) {
    return value && value.length;
  }

  function validateEmail (value) {
    //TODO
    //add validation to email
    return true;
  }

  function validateUsername (value) {
    //TODO
    //add validation to email
    return false;
  }

  function trim (value) {
    //TODO
    //add validation to email
    return false;
  }

  // Add the validation bits when defining the schema
  // TODO
  // Add validation to username email
  User = new Schema({
    'id': Number,
    'username': {
      type: String,
      validate: [validateUsername, 'username not valid'],
      index: { unique: true }
    },
    'email': { 
      type: String,
      validate: [validateEmail, 'email not valid'],
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
    * Model: LoginToken
    *
    * Used for session persistence.
    */
  LoginToken = new Schema({
    email: { type: String, index: true },
    series: { type: String, index: true },
    token: { type: String, index: true }
  });

  LoginToken.method('randomToken', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  LoginToken.pre('save', function(next) {
    // Automatically create the tokens
    this.token = this.randomToken();

    if (this.isNew)
      this.series = this.randomToken();

    next();
  });

  LoginToken.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  LoginToken.virtual('cookieValue')
    .get(function() {
      return JSON.stringify({ email: this.email, token: this.token, series: this.series });
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
  db.model('LoginToken', LoginToken);

  callback();
}

exports.defineModels = defineModels; 

