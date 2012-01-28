/*
 * GET home page.
 */


var customerRoutes  = require('./customer.js')
  ,	generalRoutes  = require('./general.js');

exports.customer = customerRoutes;
exports.general = generalRoutes;


