/*
 * GET home page.
 */

exports.all = function (req, res) {
  console.log("all customers route");
  console.log("req.currentUser: %o", req.currentUser);
  res.render('customer/customers', 
    {
      layout: 'includes/layout',
      title: 'Customer'
    }
  );
}


exports.add = function (req, res) {
  console.log("add customer route");
  res.render('customer/customers', 
    {
      layout: 'includes/layout',
      title: 'Customer'
    }
  );
}
