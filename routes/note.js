var mongoose = require('mongoose')
  , Customer = require('./../models').Customer
  , Note = require('./../models').Note
  , config = require('./../config')
  , domain = 'http://localhost:11342/'
  , Schema = mongoose.Schema
  , ObjectId = mongoose.Types.ObjectId;


exports.all = function (req, res) {
  console.log("all notes route");

  //console.log("customer details route");
  Customer.findOne({ _id : new ObjectId(req.params.id) }, function (err, customer) {
    if(!customer){
      console.log("get specific customer not successful");
    }else{
      var breadcrumb = {
        cust : {
          id : customer._id,
          name : customer.firstName + " " + customer.lastName
        }
      }
      req.session.breadcrumb = breadcrumb;
      res.render('customer/custDetails',
        {
          layout: 'includes/layout',
          title: 'Customer',
          customer: customer,
          breadcrumb: breadcrumb,
          errors: false
        }
      );
    }
  });

};

exports.add = function (req, res) {
  console.log("add note route");
  var custId = new ObjectId(req.params.id);
  if (!custId) {
    // TODO implement ASSERTIONS. Look at how firefox does ASSERTIONS
    console.log("custId shouldn be null")
    // redirect to 404
    return;
  }
  var note = new Note(req.body.note);
  console.log("custId: ", custId);
  console.log("note: ", note);
  Customer.update(
    {"_id": custId},
    {
      $push: {
        "noteSet": note,
      }
    },
    {upsert:true,safe:true},
    function (err) {
      console.log("err: ", err);
      err ? res.send({"error": true}) : res.send({"error": false});
    }
  );
};


exports.delete = function (req, res) {
  console.log("delete note route");

  Customer.findOne({ _id : new ObjectId(req.params.custid) }, function (err, customer) {
    if(!customer){
      console.log("get specific customer for note not successful");
    }else{
      var notes = customer.noteSet;
      var newNoteset = new Array();
      if(notes.length > 0){
        for(var i = 0; i < notes.length; i++){
          console.log("Found note: ", notes[i]);
          console.log("Comparing against ID: " + (req.params.noteid));
          if(notes[i]._id != (req.params.noteid)){
            //console.log("delete the note");
            newNoteset.push(notes[i]);
            console.log("newNoteset contains: ", newNoteset[i]);
          }
        }

        /***************************/

          var conditions  = { _id : new ObjectId(req.params.custid) }
            , update      = { noteSet : newNoteset }
          ;
          Customer.update(conditions, update, function (err, numAffected) {
            if (err || numAffected == 0){
              return customerEditFailed();
            }
          });

        /********************************/

      var breadcrumb = {
        cust : {
          id : customer._id,
          name : customer.firstName + " " + customer.lastName
        }
      }
      req.session.breadcrumb = breadcrumb;
      res.render('customer/details/custDetails',
        {
          layout: 'includes/layout',
          title: 'Customer',
          customer: customer,
          breadcrumb: breadcrumb,
          errors: false
        }
      );
      }else{
        console.log("No notes found for this customer.");
      }
    }
  });
};


exports.edit = function (req, res) {
  console.log("edit notes route");

  Customer.findOne({ _id : new ObjectId(req.params.custid) }, function (err, customer) {
    if(!customer){
      console.log("get specific customer for note not successful");
    }else{
      var note = req.body.custnote;
      var notes = customer.noteSet;
      var newNoteset = new Array();
      if(notes.length > 0){
        for(var i = 0; i < notes.length; i++){
          console.log("Found note: ", notes[i]);
          console.log("Comparing against ID: " + note.id);
          if(notes[i]._id ==  note.id){
            console.log("update the note");
            notes[i].noteText = note.noteText;
            notes[i].LastModifiedDate = Date.now();
          }
            newNoteset.push(notes[i]);
            console.log("newNoteset contains: ", newNoteset[i]);
        }

        /***************************/

          var conditions  = { _id : new ObjectId(req.params.custid) }
            , update      = { noteSet : newNoteset }
          ;
          Customer.update(conditions, update, function (err, numAffected) {
            if (err || numAffected == 0){
              return customerEditFailed();
            }
          });

        /********************************/

      var breadcrumb = {
        cust : {
          id : customer._id,
          name : customer.firstName + " " + customer.lastName
        }
      }
      req.session.breadcrumb = breadcrumb;
      res.render('customer/details/custDetails',
        {
          layout: 'includes/layout',
          title: 'Customer',
          customer: customer,
          breadcrumb: breadcrumb,
          errors: false
        }
      );
      }else{
        console.log("No notes found for this customer.");
      }
    }
  });

};
