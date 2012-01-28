//simple 
/*
 * GET home page.
 */
var bcrypt = require('bcrypt');  
  

exports.stringHash = function (stringHash) {

  var salt = bcrypt.genSaltSync(10);  
  var hash = bcrypt.hashSync(stringHash, salt);
  return hash;
}


exports.validateHash = function (userPassword, stringHash) {

  var bcrypt = require('bcrypt');  
  var salt = bcrypt.genSaltSync(10);  
  var match = bcrypt.compareSync(usrpassword, stringHash);
  return match;
}
