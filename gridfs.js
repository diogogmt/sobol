var Grid, GridStore, ObjectID, mongoose, parse, request;
var __slice = Array.prototype.slice;

mongoose = require("mongoose");
request = require("request");

GridStore = mongoose.mongo.GridStore;
Grid = mongoose.mongo.Grid;
ObjectID = mongoose.mongo.BSONPure.ObjectID;

exports.get = function(id, fn) {
  console.log("get");
  var db, store;
  db = mongoose.connection.db;
  // console.log("db: ", db);
  id = new ObjectID(id);
  store = new GridStore(db, id, "r", {
    root: "fs"
  });
  return store.open(function(err, store) {
    if (err) {
      return fn(err);
    }
    if (("" + store.filename) === ("" + store.fileId) && store.metadata && store.metadata.filename) {
      store.filename = store.metadata.filename;
    }
    return fn(null, store);
  });
};


exports.putFile = function(filename, path, options, fn) {
  console.log("putFile");
  console.log("filename: ", filename);
  console.log("path: ", path);
  console.log("options: ", options);
  var db = mongoose.connection.db;

  console.log(db);

  return new GridStore(db, filename, "w", options).open(function(err, file) {
    console.log("grid opened");
    // console.log("error: ", err);
    // console.log("file: ", file);
    // console.log("path: ", path);
    if (err) {
      return fn(err);
    }
    return file.writeFile(path, fn);
  });
};


exports.unlink = function(filename, fn) {
  console.log("unlink");
  console.log("filename: ", filename);
  var db = mongoose.connection.db;

  return GridStore.unlink(db, filename, fn);
};
