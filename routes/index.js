/*
 * GET home page.
 */

var customer = require('./customer.js')
  ,	job = require('./job.js')
  ,	general = require('./general.js')
  ,	user = require('./user.js');

exports.job = job;
exports.customer = customer;
exports.general = general;
exports.user = user;
