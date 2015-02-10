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
var naList = {
  "jbassen": "",
  "dill": "",
  "mpkim": "",
  "kgibb": "",
  "nayakne": "",
  "kggriswo": ""
};

// data = [{exercise, username, timeMil, timeStr, hasAttempted, willAttempt,
// isPassing, willPass, currentSub, finalSub, started, delta}]

Interaction
.find()
//.where("time").lt(onTimeDeadline)
.where('exercise').gt(2).lt(12)
.where("username") //.ne("jbassen").ne("dill")
.sort({ 'exercise': 1, 'username': 1, 'time': 1 })
.exec(function(err, subs) {

  mongoose.connection.close();

  var started = 0;
  var attempts = 0;
  var willPass = false;

  for(var i = 0; i < subs.length; i++) {
    if( _.has(naList, subs[i].username) ) {
      continue;
    }
    if (attempts === 0) {
      started = subs[i].time.getTime();
    }
    attempts += 1;
    if( _.has(JSON.parse(subs[i].grade), "message") ) {
      willPass = true;
    }
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

    //console.log( _.has(JSON.parse(subs[i].grade), "message") );
    // /console.log(exercise + ": " + willPass);

    summary[exercise][username] = {
      started: started,
      willAttempt: willAttempt,
      fTimeMillis: timeMil,
      fTimeString: timeStr,
      willPass: willPass //,
      //finalSub: JSON.parse(subs[i].answer).proof
    };

    willPass = false;
  }

  //console.log(summary);

  var data = [];
  for(var i = 0; i < subs.length; i++) {
    if( _.has( naList, subs[i].username ) ) {
      continue;
    }
    attempts += 1;
    var hasAttempted = attempts;
    if (i < subs.length - 1) {
      if (subs[i].username !== subs[i+1].username) {
        attempts = 0;
      }
    }

    var isPassing = false;
    if( _.has(JSON.parse(subs[i].grade), "message") ) {
      isPassing = true;
    }

    var delta = 0
    if (subs[i].time.getTime() !== summary[subs[i].exercise][subs[i].username].started) {
      delta = subs[i].time.getTime() - subs[i-1].time.getTime()
    }

    data.push({
      exercise: subs[i].exercise.toString(),
      username: subs[i].username,
      timeMil: subs[i].time.getTime(),
      timeStr: subs[i].time.toString(),
      hasAttempted: hasAttempted,
      willAttempt: summary[subs[i].exercise][subs[i].username].willAttempt,
      isPassing: isPassing,
      willPass: summary[subs[i].exercise][subs[i].username].willPass,
      started: summary[subs[i].exercise][subs[i].username].started,
      delta: delta //,
      //currentSub: JSON.parse(subs[i].answer).proof,
      //finalSub: summary[username][exercise].finalSub
    });

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
