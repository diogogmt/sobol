


var nodemailer = require('nodemailer');

// Set up SMTP server settings
nodemailer.SMTP = {
  host: 'smtp.gmail.com',
  port: 465,
  use_authentication: true,
  ssl: true,
  user: 'sobolinc@gmail.com',
  pass: 'sobolbts',
  // debug: true
};


exports.send = function (options) {
  // Send the e-mail
  try {
      nodemailer.send_mail(options.message, options.callback);
  }
  catch(e) {
      console.log('Caught Exception',e);
  }
}
