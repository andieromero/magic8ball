// MODULES
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var moment = require('moment');
// require('angular-moment');

var Q_AND_A_COLLECTION = "q_and_a";

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// global db object
var db;
//process.env.MONGODB_URI
// connect to database
mongodb.MongoClient.connect("mongodb://127.0.0.1/test", function(err, database){
    if(err){
      console.log(err);
      process.exit(1);
    }
    // successfull connection save db
    db = database;
    console.log("Database connected!");

    // initialize express server
    var server = app.listen(process.env.PORT || 3000, function() {
      var port = server.address().port;
      console.log('App running on port ', port);
    });
});

// API routes for questions/answers

// error handler for endpoints
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*
 *  Route: "/qas"
 *  GET: finds feed of questions and answers
 *  POST: saves a question and answer
 */
 app.get("/qas", function(req, res){
   db.collection(Q_AND_A_COLLECTION).find({}).toArray(function(err, docs){
      if(err){
        handleError(res, err.message, "Failed to get questions and answers");
      }
      else {
        res.status(200).json(docs);
      }
   });
 });


 app.post("/qas", function(req, res) {
   var newQA = req.body;
   var momentCreated = moment();
   newQA.date = moment(momentCreated).fromNow();
   if (!(req.body.question)) {
     handleError(res, "Invalid user input", "Must provide a question.", 400);
   }

     db.collection(Q_AND_A_COLLECTION).insertOne(newQA, function(err, doc) {
     if (err) {
       handleError(res, err.message, "Failed to post question to magic 8 ball.");
     } else {
       res.status(201).json(doc.ops[0]);
     }
   });
 });

 /*
  *   Route: "/qas/:id"
  *
  */
  app.get("/qas/:id", function(req, res) {
    db.collection(Q_AND_A_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get question and answer");
      } else {
        res.status(200).json(doc);
      }
    });
  });

  app.put("/qas/:id", function(req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(Q_AND_A_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to update question and answer");
      } else {
        res.status(204).end();
      }
    });
  });

  app.delete("/qas/:id", function(req, res) {
    db.collection(Q_AND_A_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
      if (err) {
        handleError(res, err.message, "Failed to delete question and answer");
      } else {
        res.status(204).end();
      }
    });
  });
