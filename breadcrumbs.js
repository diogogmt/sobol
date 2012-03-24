var Customer = require('./models').Customer
  , Job = require('./models').Job;

exports.createBreadcrumb = function (opt, callback) {
  // console.log("createBreadcrumbs");
  console.log("opt: ", opt);
  if (opt.hasOwnProperty("customerID")) {
    // console.log("has custID prop");
    exports.getCustomer(opt.customerID, function (customer) {
      // console.log("customer breadcrumb created");
       return callback({
         "cust": customer
       });
    });
  }

  return null;
};

exports.getCustomer = function (custID, callback) {
  // console.log("getCustomer");
  // console.log("custID: ", custID);

  Customer.findOne( { "_id":  custID }, ["firstName", "lastName"], function (err, cust) {

    // console.log("err: ", err);
    // console.log("cust: ", cust);

    if (cust) {
      return callback({
        "id": cust._id,
        "name": cust.firstName + " " + cust.lastName,
      });
    }
    return callback(null);
  });

};

