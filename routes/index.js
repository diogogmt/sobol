/*
 * GET home page.
 */

var customer = require('./customer.js')
  ,	job = require('./job.js')
  , estimate = require('./estimate.js')
  , lineItem = require('./lineItem.js')
  ,	general = require('./general.js')
  ,	media = require('./media.js')
  ,	tag = require('./tag.js')
  ,	user = require('./user.js')
  ,	note = require('./note.js')

exports.customer = customer;
exports.job = job;
exports.estimate = estimate;
exports.lineItem = lineItem;
exports.general = general;
exports.media = media;
exports.tag = tag;
exports.user = user;
exports.note = note;

