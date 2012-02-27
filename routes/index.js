/*
 * GET home page.
 */

var customer = require('./customer.js')
  ,	job = require('./job.js')
  ,	general = require('./general.js')
  ,	media = require('./media.js')
  ,	tag = require('./tag.js')
  ,	user = require('./user.js')
  ,	test = require('./test.js'); // this is just for generating test data, discard when done

exports.job = job;
exports.customer = customer;
exports.general = general;
exports.media = media;
exports.tag = tag;
exports.user = user;
exports.test = test; // this is just for generating test data, discard when done

