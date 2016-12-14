// MODULES
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var Q_AND_A_COLLECTION = "q_and_a";

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// global db object
var db;

// connect to database
mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database){
    if(err){
      console.log(err);
      process.exit(1);
    }
    // successfull connection save db
    db = database;
    console.log("Database connected!");

    // initialize express server
    var server = app.listen(process.env.PORT || 8080, function() {
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
 *  Route: "/feed"
 *  GET: finds feed of questions and answers
 *  POST: saves a question and answer
 */
 app.get("/feed", function(res, req){
   db.collection(Q_AND_A).find({}).toArray(function(err, docs){
      if(err){
        handleError(res, err.message, "Failed to get questions and answers");
      }
      else {
        res.status(200).json(docs);
      }
   });
 });


 app.post("/feed", function(req, res) {
   var newQA = req.body;
   newQA.createDate = new Date();

   if (!(req.body.question)) {
     handleError(res, "Invalid user input", "Must provide a question.", 400);
   }

   db.collection(CONTACTS_COLLECTION).insertOne(newQA, function(err, doc) {
     if (err) {
       handleError(res, err.message, "Failed to post question to magic 8 ball.");
     } else {
       res.status(201).json(doc.ops[0]);
     }
   });
 });
