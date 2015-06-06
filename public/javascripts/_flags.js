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
  darkblue, orange, lishgrey, darkgrey, blue,
  darkorange, dishgrey, lightblue, lightorange, lightgrey
];

var ds = [];

var ruleFills = {};
var ruleStrokes = {};
var rules = [];

console.log(data);

var maxSubs = 0;
var maxSteps = 0;

for (var username in data) {
  
  for (var _id = 3; _id < 12; _id++) {
    var ex = _id.toString();
    if(data[username][ex].length === 0) {

    } else {

    }
  }


  if(data[username][_id].length !== 0) {
    if(data[username][_id].length > maxSubs) {
      maxSubs = data[username][_id].length;
    }
    var curSteps = data[username][_id][0].currentSteps;
    if(curSteps.length > maxSteps) {
      maxSteps = curSteps.length;
    }
    if(data[username][_id][0].willPass) {
      var steps = data[username][_id][0].finalSteps;
      for (var i=0; i<steps.length; i++) {
        var step = steps[i];
        if( ! ruleFills.hasOwnProperty(step) ) {
          ruleFills[step] = fills[rules.length % 10];
          if(rules.length < 10) {
            ruleStrokes[step] = fills[rules.length % 10];
          } else {
            ruleStrokes[step] = white;
          }
          rules.push(step);
        }
      }
    }
  }
}

//Width and height
var w = 1280;
var h = 720;
var p = 0; //padding

var ySpace = 1;
var xSpace = 1;
var rHeight = 20;
var rWidth =20; //((w - p - p) / maxSubs) - xSpace;
var cRadius = 3;
var sWidth = 2;

for (var i=0; i<data[poi][_id].length; i++) {
  for (var j=0; j<data[poi][_id][i].currentSteps.length; j++) {
    ds.push({
      username: data[poi][_id][i].username,
      timeMillis: data[poi][_id][i].timeMillis,
      timeString: data[poi][_id][i].timeString,
      timeDelta: data[poi][_id][i].timeDelta,
      timeSum: data[poi][_id][i].timeSum,
      isPassing: data[poi][_id][i].isPassing,
      subCount: i,
      stepCount: j,
      currentStep: data[poi][_id][i].currentSteps[j],
      stepStatus: data[poi][_id][i].stepStatuses[j],
      timeStart: data[poi][_id][i].timeStart,
      timeTotal: data[poi][_id][i].timeTotal
    });
  }
}

console.log(rules);
console.log(ruleFills);
console.log(ruleStrokes);

//scales
var xScale = d3.scale.linear()
.domain([0, maxSubs])
.range([p, (w - p)]);

// var yScale = d3.scale.linear()
// .domain([0, ordering.length * submissionSize])
// .range([h - p, p]);

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
  return (d.subCount * (rWidth + xSpace)) + p;
})
.attr("y", function(d) {
  return (d.stepCount * (ySpace + rHeight)) + p;
})
.attr("width", rWidth)
.attr("height", rHeight)
.attr("fill", function(d) {
  return ruleFills[d.currentStep];
})
.append("svg:title")
.text(function(d) { return d.username + "\n" + d.currentStep + "\n" + (d.timeDelta / 1000) + "\n" +  (d.timeTotal / 1000) + "\n" + d.isPassing + "\n" + d.timeString});

svg.selectAll("line")
.data(ds)
.enter()
.append("line")
.attr("stroke-width", sWidth)
.attr("stroke", function(d) {
  return ruleStrokes[d.currentStep];
})
.attr("x1", function(d) {
  return (d.subCount * (rWidth + xSpace)) + p;
})
.attr("x2", function(d) {
  return (d.subCount * (rWidth + xSpace)) + p + rWidth;
})
.attr("y1", function(d) {
  return (d.stepCount * (ySpace + rHeight)) + p;
})
.attr("y2", function(d) {
  return (d.stepCount * (ySpace + rHeight)) + p + rHeight;
})


svg.selectAll("ellipse")
.data(ds)
.enter()
.append("ellipse")
.attr("fill", white)
.attr("cx", function(d) {
  if(d.stepStatus === "bad") {
    return (d.subCount * (rWidth + xSpace)) + p + (rWidth / 2);
  }
})
.attr("cy", function(d) {
  if(d.stepStatus === "bad") {
    return (d.stepCount * (ySpace + rHeight)) + p + (rHeight / 2);
  }
})
.attr("rx", function(d) {
  if(d.stepStatus === "bad") {
    return rWidth / 4;
  }
})
.attr("ry", function(d) {
  if(d.stepStatus === "bad") {
    return rHeight / 4;
  }
})

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
