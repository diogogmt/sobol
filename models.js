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

  User = new Schema({
    'username': String,
    'email': { type: String, validate: [validatePresenceOf, 'an email is required'], index: { unique: true } },
    'hashed_password': String,
    'salt': String
  });

  User.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  User.virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password; });

  User.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  });
  
  User.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  User.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  });

  User.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
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
    'registrationDate' : Date,
    'status' : String
  });

  Customer.virtual('tel1a');
  Customer.virtual('tel1b');
  Customer.virtual('tel1c');
  Customer.virtual('tel2a');
  Customer.virtual('tel2b');
  Customer.virtual('tel2c');

  db.model('User', User);
  db.model('Customer', Customer);
  db.model('LoginToken', LoginToken);

  callback();
}

exports.defineModels = defineModels; 

