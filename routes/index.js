/*
 * GET home page.
 */

var customer = require('./customer.js')
  ,	job = require('./job.js')
  , estimate = require('./estimate.js')
  ,	general = require('./general.js')
  ,	media = require('./media.js')
  ,	tag = require('./tag.js')
  ,	user = require('./user.js')
  ,	note = require('./note.js')
  ,	test = require('./test.js'); // this is just for generating test data, discard when done

exports.customer = customer;
exports.job = job;
exports.estimate = estimate;
exports.general = general;
exports.media = media;
exports.tag = tag;
exports.user = user;
exports.note = note;
exports.test = test; // this is just for generating test data, discard when done

