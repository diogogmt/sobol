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

exports.put = function() {
  console.log("put");
  var buf, db, fn, name, options, _i;
  buf = arguments[0], name = arguments[1], options = 4 <= arguments.length ? __slice.call(arguments, 2, _i = arguments.length - 1) : (_i = 2, []), fn = arguments[_i++];
  db = mongoose.connection.db;
  // console.log("db: ", db);
  options = parse(options);
  options.metadata.filename = name;
  return new GridStore(db, name, "w", options).open(function(err, file) {
    if (err) {
      return fn(err);
    }
    return file.write(buf, true, fn);
  });
};

exports.putFile = function(path, name, options, fn) {
  console.log("putFile");
  var db;
  db = mongoose.connection.db;
  // console.log("db: ", db);
  options = parse(options);
  options.metadata.filename = name;
  return new GridStore(db, name, "w", options).open(function(err, file) {
    if (err) {
      return fn(err);
    }
    return file.writeFile(path, fn);
  });
};

parse = function(options) {
  console.log("parse");
  var opts;
  opts = {};
  if (options.length > 0) {
    opts = options[0];
  }
  if (!opts.metadata) {
    opts.metadata = {};
  }
  return opts;
};