var check = require('validator').check
  , sanitize = require('validator').sanitize;
  
exports.userValidator = function (user, callback) {
  console.log("validateUser");

  var errors = new Array();

  // Username
  try {
    check(user.username, 'Username empty').notEmpty();
    user.username = sanitize(user.username).trim();
  } catch (e) {
      console.log(e.message); //Please enter a valid integer
      errors['username'] = e.message;
  }

  //Email
  try {
    check(user.email, 'Email empty').notEmpty();
    user.email = sanitize(user.email).trim();
    check(user.email, 'Email not valid').isEmail();
    
  } catch (e) {
      console.log(e.message); //Please enter a valid integer
      errors['email'] = e.message;
  }

  // Password
  try {
    check(user.password, 'Password empty').notEmpty();
    check(user.password, 'Password must be more than 4 characters').len(4,9999);

  } catch (e) {
      console.log(e.message); //Please enter a valid integer
      errors['password'] = e.message
  }

  User.findOne()
    .$or([{'username': user.username},{'email': user.email}])
    .run(function (err, doc) {
      console.log("doc: ", doc);
      if (doc && doc.username == user.username) {
        errors['username'] = "Username already exists";
      }
      else if (doc && doc.email == user.email) {
        errors['email'] = "Email already exists";
      }

      // console.log("errors: ", errors);
      // console.log("callback: ", callback);
      callback(errors);
    });
}

exports.loginValidator = function (user, callback) {
  //console.log("loginUser");

  var errors = new Array();

  // Username
  try {
    check(user.username, 'Please enter an username').notEmpty();
    user.username = sanitize(user.username).trim();
  } 
  catch (e) {
      console.log(e.message); //Please enter a valid integer
      errors['username'] = e.message;
  }

  // Password
  try {
    check(user.password, 'Please enter a password').notEmpty();
  } 
  catch (e) {
      console.log(e.message); //Please enter a valid integer
      errors['password'] = e.message
  }

  callback(errors);
}