var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var mongoose = require('mongoose');
var Assignment = require('./models/Assignment');
var Exercise = require('./models/Exercise');
var Interaction = require('./models/Interaction');
var User = require('./models/User');
var usernames = require('./usernames');

var maxDelta = 300000;//5mins
var shortDelta = maxDelta * 6;//30mins
var longDelta = shortDelta * 2 * 4;//4hrs

mongoose.connect(process.env.MONGOHQ_URL);

// submissions[username][exercise] = [{username, exercise, timeMillis,
//   timeString, timeDelta, timeSum, isPassing, currentSub, currentSteps,
//   timeStart, timeTotal, willPass, finalSub, finalSteps}]

var submissions = {};
_.forEach(usernames, function(v,username){
  submissions[username] = {};
  for(var j=3; j<12; j++) {
    submissions[username][j.toString()] = [];
  }
});

var specials = {}; //special (mystery) people

Interaction
.find()
.where('exercise').gte(3).lt(12)
.sort({ 'exercise': 1, 'username': 1, 'time': 1 })
.exec(function(err, subs) {

  mongoose.connection.close();

  var willPass = false;
  var timeStart = 0;
  var timeSum = 0;
  var attempt = 0;
  var nonZero = 0;

  for(var i = 0; i < subs.length; i++) {
    if( ! _.has(usernames, subs[i].username) ) {
      specials[subs[i].username] = "";
      continue;
    }

    if (timeStart === 0) {
      timeStart = subs[i].time.getTime();
      timeDelta = 0;
    } else {
      timeDelta = subs[i].time.getTime() - subs[i-1].time.getTime();

      var breaking = false;
      var longBreaking = false;
      if(timeDelta > shortDelta) {
        breaking = true;
      }
      if(timeDelta > longDelta) {
        longBreaking = true;
      }

      if (timeDelta > maxDelta) {
        timeDelta = 0;
      }
    }

    if( _.has(JSON.parse(subs[i].grade), "message") ) {
      willPass = true;
    }
    timeSum += timeDelta;

    var exercise = subs[i].exercise.toString();
    var username = subs[i].username;
    var timeMillis = subs[i].time.getTime();
    var timeString = subs[i].time.toString();

    var isPassing = false;
    if( _.has(JSON.parse(subs[i].grade), "message") ) {
      isPassing = true;
      willPass = true;
    }

    currentSub = JSON.parse(subs[i].answer).proof;

    var currentSteps = [];
    // populate currentSteps
    var lines = currentSub.split("\n");
    for(var j=0; j<lines.length; j++) {
      var uncommented = lines[j].split("//");
      var tokens = uncommented[0].split(/[\s\t]+/);
      for(var k=0; k<tokens.length - 1; k++) {
        if(tokens[k] === "by") {
          currentSteps.push(tokens[k+1])
        }
      }
    }

    //fill in data
    submissions[username][exercise].push({
      username: username,
      exercise: exercise,
      timeMillis: timeMillis,
      timeString: timeString,
      timeDelta: timeDelta,
      timeSum: 0,
      isPassing: isPassing,
      currentSub: currentSub,
      currentSteps: currentSteps,
      timeStart: timeStart,
      timeAve: 0,
      attempt: attempt,
      willAttempt: 0,
      timeTotal: 0,
      willPass: false,
      finalSub: "",
      finalSteps: [],
      breaking: breaking,
      longBreaking: longBreaking,
      breaks: 0,
      breaksOverTime: 0,
      longBreaks: 0
    });

    attempt += 1;
    if (timeDelta > 0) {
      nonZero += 1;
    }

    if (i === subs.length - 1 || subs[i].username !== subs[i+1].username) {

      var timeAve = 0;
      if (nonZero > 0 ) {
        timeAve = Math.floor(timeSum / nonZero);
      }

      var adjTimeSum = 0;


      var breaks = 0;
      var breaksOverTime = 0;
      var longBreaks = 0;

      for(var j=0; j<submissions[username][exercise].length; j++) {
        if (nonZero === 0) {
          submissions[username][exercise][j].timeDelta = maxDelta;
          adjTimeSum += maxDelta;
        } else if (submissions[username][exercise][j].timeDelta === 0) {
          submissions[username][exercise][j].timeDelta = timeAve;
          adjTimeSum += timeAve;
        } else {
          adjTimeSum += submissions[username][exercise][j].timeDelta;
        }
        submissions[username][exercise][j].timeSum = adjTimeSum;

        if(submissions[username][exercise][j].breaking) {
          breaks += 1;
        }
        if(submissions[username][exercise][j].longBreaking) {
          longBreaks += 1;
        }
      }

      for(var j=0; j<submissions[username][exercise].length; j++) {
        submissions[username][exercise][j].timeTotal = adjTimeSum;
        submissions[username][exercise][j].willPass = willPass;
        submissions[username][exercise][j].finalSub = currentSub;
        submissions[username][exercise][j].finalSteps = currentSteps;
        submissions[username][exercise][j].willAttempt = attempt;
        submissions[username][exercise][j].timeAve = timeAve;
        submissions[username][exercise][j].breaks = breaks;
        submissions[username][exercise][j].breaksOverTime = breaks / adjTimeSum;
        submissions[username][exercise][j].longBreaks = longBreaks;

        // if(willPass && exercise === "10") {
        //   console.log(username);
        //   console.log(currentSteps);
        // }
      }

      willPass = false;
      timeStart = 0;
      timeSum = 0;
      attempt = 0;
      nonZero = 0;
    }

  }

  var dataStr = "exports.data = ";
  dataStr += JSON.stringify(submissions);

  fs.writeFile("./old_subs.js", dataStr, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The data was saved!");
    }
  });

});
