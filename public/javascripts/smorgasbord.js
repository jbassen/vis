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
"orIdempotence": {"fill":darkblue, "stroke":"down"} //actually not used
}


console.log(data);


var usernames = [];
_.forEach(data, function(username_obj, username) {
  totalBoxes += nameBoxes;
  totalBoxes += timeBoxes;
  usernames.push(username);
});
usernames.sort();

var subs = {};
var sols = [[],[],[],[],[]];
var flagBoxes = {};

// for each user
for(var i=0; i<usernames.length; i++) {
  var username = usernames[i];
  subs[username] = [[],[],[],[],[]];
  flagBoxes[username] = [];
  gAttempts = [];

  // for each exercise
  for(var j=0; j<5; j++) {
    var id = "" + (j + 7);

    // for each submission
    for(var k=0; k<data[username][id].length; k++) {
      // add time to gAttempts
      gAttempts.push(data[username][id][k].timeMillis);

      // add submission data
      subs[username][j].push(
        {
          username: data[username][id][k].username,
          exercise: data[username][id][k].exercise,
          timeMillis: data[username][id][k].timeMillis,
          timeString: data[username][id][k].timeString,
          timeDelta: data[username][id][k].timeDelta,
          timeSum: data[username][id][k].timeSum,
          timeTotal: data[username][id][k].timeTotal,
          isPassing: data[username][id][k].isPassing,
          status: data[username][id][k].status,
          attempt: data[username][id][k].attempt,
          gAttempt: 0, // global attempt (across all exercises)
          willAttempt: data[username][id][k].willAttempt,
          willPass: data[username][id][k].willPass,
          currentRule: data[username][id][k].currentRule,
          currentSteps: data[username][id][k].currentSteps,
          stepStatuses: data[username][id][k].stepStatuses,
          currentGoal: "",
          currentMissing: "",
          currentBuggy: ""
        }
      );

      // if isPassing
      if(data[username][id][k].isPassing) {
        var solExists = false; //solution is already in sols

        // Check if solution already exists
        // for each sol
        for(var sol=0; sol<sols[j].length; sol++) {
          if(sols[j][sol].length === data[username][id][k].currentSteps.length) {

            var sameSol = true; //is the same solution
            // for each step in sol
            for(var l=0; l<sols[j][sol].length; l++) {
              // if(! used[data[username][id][k].currentSteps[l]]) {
              //   used[data[username][id][k].currentSteps[l]] = true;
              // }
              if(sols[j][sol][l] !== data[username][id][k].currentSteps[l]) {
                solExists = false;
                break;
              }
            }

            if(sameSol) {
              solExists = true;
            }

          }
        }

        // If solution doesn't already exist, copy the new solution into sols
        if(! solExists) {
          var index = sols[j].length;
          sols[j].push([]);
          // for each step in currentSteps
          for(var l=0; l< data[username][id][k].currentSteps.length; l++) {
            sols[j][index].push(data[username][id][k].currentSteps[l]);
          }
        }

      } // end if isPassing

    } // end submission

  } // end exercise


  gAttempts = gAttempts.sort();
  var gAttemptMap = {};

  for(var g=0; g<gAttempts.length; g++) {
    gAttemptMap[gAttempts[g].toString()] = g;
  }

  // for each exercise 2
  for(var j=0; j<5; j++) {
    var id = "" + (j + 7);

    // for each submission 2
    for(var k=0; k<subs[username][j].length; k++) {

      subs[username][j][k].gAttempt = gAttemptMap[subs[username][j][k].timeMillis.toString()];

    } // end exercise 2

  } // end submission 2


} // end user


// sort the solutions
for(var i=0; i<sols.length; i++) {
  sols[i].sort(function(a,b) {
    if(a.length < b.length) {
      return -1;
    } else if(a.length > b.length) {
      return 1;
    } else {
      return 0;
    }
  });
}

var printSols = [[],[],[],[],[]];
for(var i=0; i<sols.length; i++) {
  var minLength = sols[i][0].length;
  for(var j=0; j<sols[i].length; j++) {
    if(sols[i][j].length < minLength + 4) {
      var index = printSols[i].length;
      printSols[i].push([]);
      // for each step in currentSteps
      for(var step=0; step<sols[i][j].length; step++) {
        printSols[i][index].push(sols[i][j][step]);
      }
    } else {
      break;
    }
  }
}


// for each user 3
for(var i=0; i<usernames.length; i++) {
  var username = usernames[i];

  // for each exercise
  for(var j=0; j<5; j++) {
    var id = "" + (j + 7);

    // for each submission
    for(var k=0; k<subs[username][j].length; k++) {

      // currentRule


      // currentBuggy


      // currentGoal


      // currentMissing


      var currentPassing = {};
      var currentFailing = {};
      for(var step=0; step<subs[username][j][k].currentSteps.length; step++) {
        if(subs[username][j][k].stepStatuses[step] === "good") {
          if(! _.has(currentPassing, subs[username][j][k].currentSteps[step]) ) {
            currentPassing[subs[username][j][k].currentSteps[step]] = 1;
          } else {
            currentPassing[subs[username][j][k].currentSteps[step]] += 1;
          }
        } else {
          if(! _.has(currentFailing, subs[username][j][k].currentSteps[step]) ) {
            currentFailing[subs[username][j][k].currentSteps[step]] = 1;
          } else {
            currentFailing[subs[username][j][k].currentSteps[step]] += 1;
          }
          subs[username][j][k].currentBuggy = subs[username][j][k].currentSteps[step];
        }
      }

      var distances = [];
      for(var sol=0; sol<sols[j].length; sol++) { // for each sol

        var solRules = {};
        for(var step=0; step<sols[j][sol].length; step++) {
          if(! _.has(solRules, sols[j][sol][step]) ) {
            solRules[sols[j][sol][step]] = 1;
          } else {
            solRules[sols[j][sol][step]] += 1;
          }
        }

        var distance = 0;
        for(var step=0; step<sols[j][sol].length; step++) {
          if(! _.has(currentPassing, sols[j][sol][step]) ) {
            distance += solRules[sols[j][sol][step]];
          } else if(currentPassing[sols[j][sol][step]] < solRules[sols[j][sol][step]]) {
            distance += solRules[sols[j][sol][step]] - currentPassing[sols[j][sol][step]];
          } else {
            continue;
          }
        }
        distances.push(distance);

      } // end sol

      var closest = 0;
      var closestDist = 25;
      for(var d=0; d<distances.length; d++) {
        if(distance[d] <= closestDist) {
          closestDist = distance[d];
          closest = d;
        }
      }

      var solRules = {};
      for(var step=0; step<sols[j][closest].length; step++) {
        if(! _.has(solRules, sols[j][closest][step]) ) {
          solRules[sols[j][closest][step]] = 1;
        } else {
          solRules[sols[j][closest][step]] += 1;
        }
      }

      var differences = {}
      _.forEach(solRules, function(count,rule){
        if(! _.has(currentPassing, rule) ) {
          differences[rule] = count;
        } else if(solRules[rule] > currentPassing[rule]) {
          differences[rule] = solRules[rule] - currentPassing[rule];
        }
      });

      // finalize goal/buggy/missing rule...
      subs[username][j][k].currentGoal = "";
      if( _.has(differences, subs[username][j][k].currentRule) ) {
        if( _.has(currentFailing, subs[username][j][k].currentRule) ) {
          subs[username][j][k].currentGoal = subs[username][j][k].currentRule;
          subs[username][j][k].currentMissing = "";
          subs[username][j][k].currentBuggy = subs[username][j][k].currentRule;
          break;
        } else {
          subs[username][j][k].currentGoal = subs[username][j][k].currentRule;
          subs[username][j][k].currentMissing = subs[username][j][k].currentRule;
          break;
        }
      } else {
        for(var step=0; step<sols[j][closest].length; step++) {
          if( _.has(currentPassing, sols[j][closest][step])) {
            if(currentPassing[sols[j][closest][step]] === 0) {
              subs[username][j][k].currentGoal = sols[j][closest][step];
              subs[username][j][k].currentMissing = sols[j][closest][step];
              break;
            } else {
              currentPassing[sols[j][closest][step]] -=1;
            }
          } else {
            subs[username][j][k].currentGoal = sols[j][closest][step];
            subs[username][j][k].currentMissing = sols[j][closest][step];
            break;
          }
        }
      }

    } // end submission 3

  } // end exercise 3

} // end user 3


var nameBoxes = 3; //username
var timeBoxes = 6; //time plots
// var exerciseBoxes = 3; //exercise
// var statTimeBoxes = 3; //status time plot
// var statusBoxes = 3; //status plot
var flagBoxes = {}; //every flag plot
var totalBoxes = 0;
var maxSubs = 0;
var maxSteps = 0;


console.log(subs);
console.log(sols);

// Graph constants...

var ySpace = 1;
var xSpace = 1;
var rHeight = 9;
var rWidth = 9;
var cRadius = 4;
var sWidth = 2;

var boxHeight = rHeight + ySpace;
var boxWidth = rWidth + xSpace;

// console.log(boxWidth);
// console.log(maxSteps);

//Width and height
var p = boxWidth * 4; //padding (space for correct solutions)
var w = (boxWidth * 280);
var h = (boxHeight * 3000);

var wScreen = 1420; // true screen width


// Scaling
var releaseDate = new Date(2015, 0, 16, 20, 00, 00, 00).getTime();
var earlyDeadline = new Date(2015, 0, 22, 00, 05, 0).getTime();
var onTimeDeadline = new Date(2015, 0, 23, 12, 35, 0).getTime();

var sat = new Date(2015, 0, 17, 00, 00, 00, 00).getTime();
var sun = new Date(2015, 0, 18, 00, 00, 00, 00).getTime();
var mon = new Date(2015, 0, 19, 00, 00, 00, 00).getTime();
var tue = new Date(2015, 0, 20, 00, 00, 00, 00).getTime();
var wed = new Date(2015, 0, 21, 00, 00, 00, 00).getTime();
var thu = new Date(2015, 0, 22, 00, 00, 00, 00).getTime();
var fri = new Date(2015, 0, 23, 00, 00, 00, 00).getTime();

var midnights = [sat, sun, mon, tue, wed, thu, fri];


// scale time to fit screen
var timeScale = d3.scale.linear()
.domain([releaseDate, onTimeDeadline + 1800000])
.range([0, wScreen]);

// no step scaling


var offset = 0; //the current offset from the top

// add the canvas to the body of the webpage
var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h)
.attr("class", "axis")


// for each user
for(var i=0; i<usernames.length; i++) {
  var username = usernames[i];
  //console.log(username)
  offset += nameBoxes * boxHeight;
  svg.append("text")
   .text(username)
   .attr("x", 0)
   .attr("y", offset);

  // Deadlines
  // earlyDeadline
  svg.append("line")
  .attr("stroke-width", sWidth * 2)
  .attr("stroke", black)
  .attr("x1", timeScale(earlyDeadline))
  .attr("x2", timeScale(earlyDeadline))
  .attr("y1", offset)
  .attr("y2", offset + (timeBoxes * boxHeight));
  // onTimeDeadline
  svg.append("line")
  .attr("stroke-width", sWidth * 2)
  .attr("stroke", black)
  .attr("x1", timeScale(onTimeDeadline))
  .attr("x2", timeScale(onTimeDeadline))
  .attr("y1", offset)
  .attr("y2", offset + (timeBoxes * boxHeight));

  // Midnights
  for(m=0; m<midnights.length; m++) {
    svg.append("line")
    .attr("stroke-width", sWidth / 2)
    .attr("stroke", lightgrey)
    .attr("x1", timeScale(midnights[m]))
    .attr("x2", timeScale(midnights[m]))
    .attr("y1", offset)
    .attr("y2", offset + (timeBoxes * boxHeight));
  }

  // for each exercise
  for(var j=0; j<5; j++) {
    // console.log(j)
    // console.log(subs[username][j])
    var id = "" + (j + 7);
    offset += boxHeight;

    svg.append("line")
    .attr("stroke-width", sWidth)
    .attr("stroke", lightgrey)
    .attr("x1", 0)
    .attr("x2", wScreen)
    .attr("y1", offset)
    .attr("y2", offset);


    // for each submission
    for(var sub=0; sub<subs[username][j].length; sub++) {
      svg.append("circle")
      .attr("cx", timeScale(subs[username][j][sub].timeMillis))
      .attr("cy", offset)
      .attr("r", cRadius)
      .attr("fill", function() {
        if(subs[username][j][sub].isPassing === true) {
          return darkblue;
        } else if (subs[username][j][sub].willPass === true) {
          return lightblue;
        } else {
          return orange;
        }
      })
      .append("svg:title")
      .text(function() { return subs[username][j][sub].username + "\n" + subs[username][j][sub].timeString; });
    }
  }


  for(var j=0; j<5; j++) {
    for(var sub=0; sub<subs[username][j].length; sub++) {
      // currentGoal
      svg.append("rect")
      .attr("x", p + (subs[username][j][sub].gAttempt * boxWidth) )
      .attr("y", offset + nameBoxes + (boxHeight * 1))
      .attr("width", rWidth)
      .attr("height", rHeight)
      .attr("fill", function() {
        if(_.has(coloring, subs[username][j][sub].currentGoal) ) {
          return coloring[subs[username][j][sub].currentGoal].fill;
        } else {
          return black;
        }
      })

      //currentMissing
      svg.append("rect")
      .attr("x", p + (subs[username][j][sub].gAttempt * boxWidth) )
      .attr("y", offset + nameBoxes + (boxHeight * 2) )
      .attr("width", rWidth)
      .attr("height", rHeight)
      .attr("fill", function() {
        if(_.has(coloring, subs[username][j][sub].currentMissing) ) {
          return coloring[subs[username][j][sub].currentMissing].fill;
        } else {
          return black;
        }
      })

      //currentBuggy
      // currentGoal
      svg.append("rect")
      .attr("x", p + (subs[username][j][sub].gAttempt * boxWidth))
      .attr("y", offset + nameBoxes + (boxHeight * 3) )
      .attr("width", rWidth)
      .attr("height", rHeight)
      .attr("fill", function() {
        if(_.has(coloring, subs[username][j][sub].currentBuggy) ) {
          return coloring[subs[username][j][sub].currentBuggy].fill;
        } else {
          return black;
        }
      })

    }
    offset += 5*boxHeight;


  } // end exercise


} // end user
