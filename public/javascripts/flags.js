//Colorblind Color Scheme
var darkblue = "rgb(0,107,164)";
var orange = "rgb(255,128,14)";
var lishgrey = "rgb(171,171,171)";
var darkgrey = "rgb(89,89,89)";
var blue = "rgb(95,158,209)";
var darkorange = "rgb(200,82,0)";
var dishgrey = "rgb(137,137,137)";
var lightblue = "rgb(162,200,236)";
var lightorange = "rgb(255,188,121)";
var lightgrey = "rgb(207,207,207)";

var white = "rgb(255,255,255)";
var black = "rgb(0,0,0)";

var fills = [
  darkblue, orange, lishgrey, darkgrey, blue, darkorange,
  dishgrey, lightblue, lightorange, lightgrey
];
var strokes = [white, black];

//Width and height
var w = 1280;
//var h = 720;
var p = 40; //padding

var fillSize = 20;
var strokeSize = 2;
var submissionSize = 400;

var earlyDeadline;
var onTimeDeadline;
if ( parseInt(_id) < 7 ) {
  earlyDeadline = new Date(2015, 0, 14, 00, 05, 0).getTime();
  onTimeDeadline = new Date(2015, 0, 16, 12, 35, 0).getTime();
} else if ( parseInt(_id) < 12) {
  earlyDeadline = new Date(2015, 0, 22, 00, 05, 0).getTime();
  onTimeDeadline = new Date(2015, 0, 23, 12, 35, 0).getTime();
} else {
  earlyDeadline = new Date(2015, 0, 20, 00, 05, 0).getTime();
  onTimeDeadline = new Date(2015, 0, 23, 12, 35, 0).getTime();
}

var ds = [];
var ordering = [];
var usernames = {};

var ruleFills = {};
var ruleStrokes = {};
var rules = [];

console.log(data);

for (var username in data) {
  var timeStart = 0;
  var timeTotal = 0;
  var willPass = false;
  if(data[username][_id].length !== 0) {
    timeStart = data[username][_id][0].timeStart;
    timeTotal = data[username][_id][0].timeTotal;
    // console.log(username);
    // console.log(data[username][_id][0].willPass);
    // console.log(data[username][_id][0].finalSteps);
    if(data[username][_id][0].willPass) {
      willPass = true;
      var steps = data[username][_id][0].finalSteps;
      for (var i=0; i<steps.length; i++) {
        var step = steps[i];
        if( ! ruleFills.hasOwnProperty(step) ) {
          ruleFills[step] = fills[rules.length % 10];
          ruleStrokes[step] = strokes[Math.floor(rules.length / 10)]
          rules.push(step);
        }
      }
    }
  }
  ordering.push({
    username: username,
    timeStart: timeStart,
    timeTotal: timeTotal,
    order: 0,
    willPass: willPass
  });
  for (var i=0; i<data[username][_id].length; i++) {
    for (var j=0; j<data[username][_id][i].currentSteps.length; j++) {
      // var matchingStep = "empty";
      // if(data[username][_id][i].finalSteps.length <= j+1) {
      //   matchingStep = data[username][_id][i].finalSteps[j];
      // }

      ds.push({
        username: username,
        timeMillis: data[username][_id][i].timeMillis,
        timeString: data[username][_id][i].timeString,
        timeDelta: data[username][_id][i].timeDelta,
        timeSum: data[username][_id][i].timeSum,
        isPassing: data[username][_id][i].isPassing,
        willPass: data[username][_id][i].willPass,
        stepCount: j,
        currentStep: data[username][_id][i].currentSteps[j],
        // matchingStep: matchingStep,
        timeStart: data[username][_id][i].timeStart,
        timeTotal: data[username][_id][i].timeTotal
      })
    }
  }
}

console.log(d3.max(ds, function(d) {return d.timeTotal}));

console.log(rules);
console.log(ruleFills);
console.log(ruleStrokes);

var h = ordering.length * submissionSize;

function compareOrder(a,b) {
  if (a.timeTotal < b.timeTotal)
     return 1;
  if (a.timeTotal > b.timeTotal)
    return -1;
  return 0;
}

ordering.sort(compareOrder);
for(var i=0; i<ordering.length; i++) {
  ordering[i].order = i;
  usernames[ordering[i].username] = i;
}

//scales
var xScale = d3.scale.linear()
.domain([0, d3.max(ds, function(d) { return d.timeSum; })
])
.range([p, (w - p)]);

var yScale = d3.scale.linear()
.domain([0, ordering.length * submissionSize])
.range([h - p, p]);


// add the canvas to the body of the webpage
var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h)
.attr("class", "axis")

svg.selectAll("rect")
.data(ds)
.enter()
.append("rect")
.attr("x", function(d) {
  return xScale(d.timeSum - d.timeDelta);
})
.attr("y", function(d) {
  return yScale(
    (usernames[d.username] * submissionSize)
    + (d.stepCount * (fillSize + (strokeSize*3) ) )
  );
})
.attr("width", function(d) {return d.timeDelta / 10000})//xScale(.0002 * d.timeDelta)})
.attr("height", fillSize)
.attr("fill", function(d) {
  return ruleFills[d.currentStep];
})
.attr("stroke", function(d) {
  return ruleStrokes[d.currentStep];
})
.attr("stroke-width", strokeSize)
.append("svg:title")
.text(function(d) { return d.currentStep + "\n" + d.username + "\n" + (d.timeDelta / 1000) + "\n" +  (d.timeTotal / 1000) + "\n" + d.isPassing + "\n" + d.timeString});

// svg.selectAll("text")
// .data(ordering)
// .enter()
// .append("text")
// .text(function(d) {
//   return d.username;
// })
// .attr("text-anchor", "end")
// .attr("x", 50)
// .attr("y", function(d) {
//   console.log("" + p + ", " + yScale(d.order))
//   return yScale(d.order);
// })
// .attr("font-family", "sans-serif")
// .attr("font-size", "11px")
// .attr("fill", "black");
