var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var mongoose = require('mongoose');
var Assignment = require('./models/Assignment');
var Exercise = require('./models/Exercise');
var Interaction = require('./models/Interaction');
var User = require('./models/User');

mongoose.connect(process.env.MONGOHQ_URL);
var summary = {};

// data = [{exercise, username, timeMil, timeStr, hasAttempted, willAttempt, isPassing, willPass, currentSub, finalSub}]

Interaction
.find()
//.where("time").lt(onTimeDeadline)
.where('exercise').gt(2).lt(12)
.where("username").ne("jbassen").ne("dill")
.sort({ 'exercise': 1, 'username': 1, 'time': 1 })
.exec(function(err, subs) {

  mongoose.connection.close();

  var attempts = 0;

  for(var i = 0; i < subs.length; i++) {
    attempts += 1;
    var willAttempt = attempts;
    if (i < subs.length - 1) {
      if (subs[i].username === subs[i+1].username) {
        continue;
      }
    }
    attempts = 0;

    var exercise = subs[i].exercise.toString();
    var username = subs[i].username;
    var timeMil = subs[i].time.getTime();
    var timeStr = subs[i].time.toString();

    if (! _.has(summary, exercise) ) {
      summary[exercise] = {}
    }

    summary[exercise][username] = {
      willAttempt: willAttempt,
      fTimeMillis: timeMil,
      fTimeString: timeStr,
      willPass: false//,
      //finalSub: JSON.parse(subs[i].answer).proof
    };

    if( JSON.parse(subs[i].grade).message === "Success!" ) {
      summary[exercise][username].willPass = true;
    }

  }

  var data = [];
  for(var i = 0; i < subs.length; i++) {
    attempts += 1;
    var hasAttempted = attempts;
    if (i < subs.length - 1) {
      if (subs[i].username !== subs[i+1].username) {
        attempts = 0;
      }
    }

    data.push({
      exercise: subs[i].exercise.toString(),
      username: subs[i].username,
      timeMil: subs[i].time.getTime(),
      timeStr: subs[i].time.toString(),
      hasAttempted: hasAttempted,
      willAttempt: summary[exercise][username].willAttempt,
      isPassing: false,
      willPass: summary[exercise][username].willPass//,
      //currentSub: JSON.parse(subs[i].answer).proof,
      //finalSub: summary[username][exercise].finalSub
    });

    if( JSON.parse(subs[i].grade).message === "Success!" ) {
      summary[exercise][username].isPassing = true;
    }

  }

  var dataStr = "exports.data = ";
  dataStr += JSON.stringify(data);

  fs.writeFile("./subs.js", dataStr, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The data was saved!");
    }
  });

});
