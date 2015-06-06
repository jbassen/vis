var startEx = 3;
var boundEx = 12;

var rules = [
  "deMorganExists",
  "deMorganForall",
  "deMorganAnd",
  "deMorganOr",

  "distribExistsAnd",
  "distribExistsOr",
  "distribForallAnd",
  "distribForallOr",
  "distribOrAnd",
  "distribAndOr",

  "obvious",
  "renaming",

  "impliesOr",
  "bicondImplies",

  "quantElim",
  "quantReorder",

  "orInverse",
  "andInverse",

  "andIdentity",
  "orIdentity",

  "andDomination",
  "orDomination",

  "andIdempotence",
  "orIdempotence",

  "badRule"
]

var ruleDict = {
  "deMorganExists": 0,
  "deMorganForall": 1,
  "deMorganAnd": 2,
  "deMorganOr": 3,

  "distribExistsAnd": 4,
  "distribExistsOr": 5,
  "distribForallAnd": 6,
  "distribForallOr": 7,
  "distribOrAnd": 8,
  "distribAndOr": 9,

  "obvious": 10,
  "renaming": 11,

  "impliesOr": 12,
  "bicondImplies": 13,

  "quantElim": 14,
  "quantReorder": 15,

  "orInverse": 16,
  "andInverse": 17,

  "andIdentity": 18,
  "orIdentity": 19,

  "andDomination": 20,
  "orDomination": 21,

  "andIdempotence": 22,
  "orIdempotence": 23,

  "badRule": 24
}

//Colorblind Color Scheme
var darkgrey = "rgb(89,89,89)";
var darkblue = "rgb(0,107,164)";
var darkorange = "rgb(200,82,0)";
var lishgrey = "rgb(171,171,171)";
var blue = "rgb(95,158,209)";
var orange = "rgb(255,128,14)";
var dishgrey = "rgb(137,137,137)";
var lightblue = "rgb(162,200,236)";
var lightorange = "rgb(255,188,121)";
var lightgrey = "rgb(207,207,207)";

var white = "rgb(255,255,255)";
var black = "rgb(0,0,0)";

//Rule Labeling
var coloring = {
"deMorganExists": {"fill":lightgrey, "stroke":"none"},
"deMorganForall": {"fill":lishgrey, "stroke":"none"},
"deMorganAnd": {"fill":dishgrey, "stroke":"none"},
"deMorganOr": {"fill":darkgrey, "stroke":"none"},

"distribExistsAnd": {"fill":lightorange, "stroke":"none"},
"distribExistsOr": {"fill":lightblue, "stroke":"none"},
"distribForallAnd": {"fill":orange, "stroke":"up"},
"distribForallOr": {"fill":blue, "stroke":"up"},
"distribOrAnd": {"fill":darkorange, "stroke":"down"},
"distribAndOr": {"fill":darkblue, "stroke":"down"}, //actually not used

"obvious": {"fill":darkgrey, "stroke":"up"},
"renaming": {"fill":darkgrey, "stroke":"down"},

"impliesOr": {"fill":lightorange, "stroke":"none"},
"bicondImplies": {"fill":lightorange, "stroke":"none"}, //actually not used

"quantElim": {"fill":orange, "stroke":"up"},
"quantReorder": {"fill":orange, "stroke":"down"}, //actually not used

"orInverse": {"fill":darkorange, "stroke":"up"},
"andInverse": {"fill":darkorange, "stroke":"down"}, //actually not used

"andIdentity": {"fill":lightblue, "stroke":"up"}, //actually not used
"orIdentity": {"fill":lightblue, "stroke":"down"}, //actually not used

"andDomination": {"fill":blue, "stroke":"up"}, //actually not used
"orDomination": {"fill":blue, "stroke":"down"}, //actually not used

"andIdempotence": {"fill":darkblue, "stroke":"up"}, //actually not used
"orIdempotence": {"fill":darkblue, "stroke":"down"}, //actually not used

"badRule": {"fill":black, "stroke":"none"}
}

console.log(data);

var mostSubmissions = 0;

var userSubmissions = {};
var usernames = [];
_.forEach(data, function(username_obj, username) {
  userSubmissions[username] = 0;
  usernames.push(username);

  _.forEach(username_obj, function(ex_obj, ex) {
    userSubmissions[username] += username_obj[ex].length;
  });
  if(userSubmissions[username] > mostSubmissions) {
    mostSubmissions = userSubmissions[username];
  }
});
usernames.sort(function(a,b) { return userSubmissions[a] - userSubmissions[b]; });

//console.log(usernames);
//console.log(userSubmissions);




var userSubs = {};
var subs = [];
var sols = [];
for(var i=startEx; i<boundEx; i++) {
  sols.push([]);
}


for(var i=0; i<usernames.length; i++) { // for each user
  var username = usernames[i];
  userSubs[username] = [];
  for(var j=0; j<boundEx - startEx; j++) { // for each exercise
    var exercise = "" + (j + startEx);

    for(var k=0; k<data[username][exercise].length; k++) { // for each submission
      var subData = data[username][exercise][k];
      var sub = {
        username: subData.username,
        user: i,
        exercise: j,
        timeMillis: subData.timeMillis,
        timeString: subData.timeString,
        isPassing: subData.isPassing,
        status: subData.status,
        attempt: subData.attempt,
        gAttempt: 0,
        willAttempt: subData.willAttempt,
        gWillAttempt: 0,
        willPass: subData.willPass,
        currentSteps: subData.currentSteps,
        stepStatuses: subData.stepStatuses,
        currentRule: subData.currentRule,
        currentRuleStatus: subData.currentRuleStatus,
        currentGoal: "",
        currentMissing: "",
        currentBuggy: "",
        passingRules: {}
      }
      userSubs[username].push(sub);

      // if isPassing
      if(sub.isPassing) {
        var solExists = false; //solution is already in sols

        // Check if solution already exists
        // for each sol
        for(var sol=0; sol<sols[j].length; sol++) {
          if(sols[j][sol].length === sub.currentSteps.length) {
            var sameSol = true; //is the same solution

            // for each step in sol
            for(var l=0; l<sols[j][sol].length; l++) {
              if(sols[j][sol][l] !== sub.currentSteps[l]) {
                solExists = false;
                break;
              }
            }

            if(sameSol) {
              solExists = true;
            }

          } // end for each step in sol

        } // end for each sol

        // If solution doesn't already exist, copy the new solution into sols
        if(! solExists) {
          var index = sols[j].length;
          sols[j].push([]);
          // for each step in currentSteps
          for(var l=0; l< sub.currentSteps.length; l++) {
            sols[j][index].push(sub.currentSteps[l]);
          }
        }

      } // end if isPassing

    } // end for each submission

  } // end for each exercise

  userSubs[username] = userSubs[username].sort(
    function(a,b) { return a.timeMillis - b.timeMillis; }
  )

  //console.log(userSubs[username]);

  var passingRules = {};
  for(var r=0; r<rules.length; r++) {
    passingRules[rules[r]] = 0;
  }

  for(var k=0; k<userSubs[username].length; k++) { // for each sub
    sub = userSubs[username][k];

    for(var l=0; l<sub.currentSteps.length; l++) { // for each step 1
      if(sub.stepStatuses[l] === "good") {
        passingRules[sub.currentSteps[l]] = 1;
      }
    } // end for each step 1

    for(var l=0; l<sub.currentSteps.length; l++) { // for each step 2
      if(sub.stepStatuses[l] === "bad") {
        if(_.has(ruleDict, sub.currentSteps[l])) {
          passingRules[sub.currentSteps[l]] = 0;
        }
      }
    } // end for each step 2

    for(var r=0; r<rules.length; r++) {
      sub.passingRules[rules[r]] = passingRules[rules[r]];
      //console.log(rules[r]);
      //console.log(passingRules[rules[r]]);
    }

    sub.gAttempt = k;
    sub.gWillAttempt = userSubs[username].length;
    subs.push(sub)

  } // end for each sub

  console.log(username)
  for(var k=0; k<userSubs[username].length; k++) {
    console.log(userSubs[username][k].passingRules);
  }

} // end for each user

var flags = [];
for(var i=0; i<subs.length; i++) { // for each sub
  var s = subs[i];
  for(var r=0; r<rules.length - 1; r++) {
    var sub = {
      username: s.username,
      user: s.user,
      exercise: s.exercise,
      timeMillis: s.timeMillis,
      timeString: s.timeString,
      isPassing: s.isPassing,
      status: s.status,
      attempt: s.attempt,
      gAttempt: s.gAttempt,
      willAttempt: s.willAttempt,
      gWillAttempt: s.gWillAttempt,
      willPass: s.willPass,
      currentRule: s.currentRule,
      currentRuleStatus: s.currentRuleStatus,
      currentGoal: s.currentGoal,
      currentMissing: s.currentMissing,
      currentBuggy: s.currentBuggy,
      flagRule: rules[r],
      flagStatus: s.passingRules[rules[r]]
    }

    flags.push(sub);
  }
}

console.log(flags);

var nameBoxes = 3; //username
var timeBoxes = 0; //time plots
var statusBoxes = 0; //status plots
var ruleBoxes = 30;

var userBoxes = nameBoxes + timeBoxes + statusBoxes + ruleBoxes;
var totalBoxes = usernames.length * userBoxes;

var xSpace = 1;
var ySpace = 1;
var rWidth = 9;
var rHeight = 9;
var cRadius = 4;
var sWidth = 2;

var boxHeight = rHeight + ySpace;
var boxWidth = rWidth + xSpace;

var p = 3 * boxWidth;
var h = totalBoxes * boxHeight + p;
var w = boxWidth * mostSubmissions + p;


// add the canvas to the body of the webpage
var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h)
.attr("class", "axis")

svg.selectAll("rect")
.data(flags)
.enter()
.append("rect")
.attr("x", function(d) {
  return ( p + (d.gAttempt * boxWidth) );
})
.attr("y", function(d) {
  return ( (d.user * userBoxes) + nameBoxes + ruleDict[d.flagRule] ) * boxHeight;
})
.attr("width", rWidth)
.attr("height", rHeight)
.attr("fill", function(d) {
  return black;
})
.append("svg:title")
.text(function(d) { return d.username + "\n" + d.currentRule + "\n" + d.exercise + "\n" + d.timeString});
