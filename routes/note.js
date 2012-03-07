var mongoose = require('mongoose')
  , Job = require('./../models').Job
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
      res.render('customer/custDetails_notes',
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

exports.getCustomerNotes = function (req, res) {
  Customer.findOne({ _id : new ObjectId(req.params.id) }, function (err, customer) {
    //console.log("The current customer is " + req.params.id);
    if(customer){
      console.log("Get specific customer for notes - SUCCESS");
      var dataSet = new Array();
      var notes = customer.noteSet;
      for(i = 0; i < notes.length; i++){
        var deleteUrl = "<a href='/customer/" + customer._id + "/note/delete/" + notes[i]._id + "'>Delete This Note</a>";
        dataSet.push([
            notes[i]._id,
            notes[i].noteText,
            new Date(notes[i].creationDate).toDateString(),
            deleteUrl
        ]);
      }
      var aaData = {
        "aaData" : dataSet
      };
      res.json(aaData);
    }
    else 
    {
      console.log("get all this customers notes - Not success");
    }
  });
}

exports.add = function (req, res) {
  console.log("add estimate route");
  var note = new Note(req.body.custnote);
  var custID = new ObjectId(req.params.id);
  function estimateAddFailed() {
    console.log("add note FAIL");
    //req.flash('addError', 'Estimate Add failed');
    res.render('customer/custDetails_notes/',
    {
      layout: 'includes/layout',
      title: 'Customer',
      customer: formCustomer,
      errors: false
    });
  };

  Customer.findOne({ _id : new ObjectId(req.params.id) }, function (err, customer) {
    if(customer){
      var noteSet = customer.noteSet;
      console.log("Pushing Note into Customer NoteSet: ", note);
      noteSet.push(note);
      customer.save(function(err) {
        if(err){
          console.log("Error saving customer after adding note");
          return noteAddFailed();
        }
        console.log("Adding note SUCCESS");
        //req.flash('info', 'The estimate has been added');
        //res.redirect('/customer/' + custID);
        var breadcrumb = {
          cust : {
            id : customer._id,
            name : customer.firstName + " " + customer.lastName
          }
        }
        req.session.breadcrumb = breadcrumb;
        res.render('customer/custDetails_notes',
          {
            layout: 'includes/layout',
            title: 'Customer',
            customer: customer,
            breadcrumb: breadcrumb,
            errors: false
          }
        );


      });
    }else{
      console.log("finding customer for add note - Not success");
    }
  });
};


exports.delete = function (req, res) {
  console.log("delete note route");

  Customer.findOne({ _id : new ObjectId(req.params.custid) }, function (err, customer) {
    if(!customer){
      console.log("get specific customer for note not successful");
    }else{
      var note;
      var notes = customer.noteSet;
      var newNoteset = new Array();
      if(notes.length > 0){
        for(var i = 0; i < notes.length; i++){
          console.log("Found note: ", notes[i]);
          console.log("Comparing against ID: " + req.params.noteid);
          if(notes[i]._id != req.params.noteid){
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
      res.render('customer/custDetails_notes',
        {
          layout: 'includes/layout',
          title: 'Customer',
          customer: customer,
          breadcrumb: breadcrumb,
          errors: false
        }
      );
      }else{
        console.log("No estimates found for this job. This shouldn't be possible");
      }
    }
  });  
};


exports.details = function (req, res) {
  console.log("notes details route");
  res.redirect('/customers');
};

