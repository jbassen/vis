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

var colorblind = [
  darkblue, orange, lishgrey, darkgrey, blue, darkorange,
  dishgrey, lightblue, lightorange, lightgrey, black, white
];

//Width and height
var w = 1280;
//var h = 720;
var p = 10; //padding

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

console.log(data);

for (var username in data) {
  var timeStart = 0;
  if(data[username][_id].length !== 0) {
    timeStart = data[username][_id][0].timeStart;
  }
  ordering.push({username: username, timeStart: timeStart, order: 0});
  for (var i=0; i<data[username][_id].length; i++) {
    ds.push(data[username][_id][i]);
  }
}

var h = ordering.length * 10;

function compareOrder(a,b) {
  if (a.timeStart < b.timeStart)
     return 1;
  if (a.timeStart > b.timeStart)
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
.domain([
  d3.min(ds, function(d) { return d.timeMillis; }),
  (onTimeDeadline + 1800000)
])
.range([p, w - p]);

var yScale = d3.scale.linear()
.domain([0, d3.max(ordering, function(d) { return d.order; })])
.range([h - p, p]);


// add the canvas to the body of the webpage
var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h)
.attr("class", "axis")

svg.selectAll("line")
.data(ordering)
.enter()
.append("line")
.attr("stroke-width", 2)
.attr("stroke", orange)
.attr("x1", 0)
.attr("x2", function(d) {
  if (d.timeStart === 0) {
    return p * 2;
  } else {
    return 0;
  }
})
.attr("y1", function(d) {
  return yScale(d.order);
})
.attr("y2", function(d) {
  return yScale(d.order);
}).append("svg:title")
.text(function(d) { return d.username});

//points
svg.selectAll("circle")
.data(ds)
.enter()
.append("circle")
.attr("cx", function(d) {
  return xScale(d.timeMillis);
})
.attr("cy", function(d) {
  return yScale(usernames[d.username]);
})
.attr("r", 4)
.attr("fill", function(d) {
  if(d.isPassing === true) {
    return darkblue;
  } else if (d.willPass === true) {
    return lightblue;
  } else {
    return orange;
  }
})
.append("svg:title")
.text(function(d) { return d.username + "\n" + d.timeString; });

svg.append("line")
.attr("stroke-width", 1)
.attr("stroke", black)
.attr("x1", xScale(earlyDeadline))
.attr("x2", xScale(earlyDeadline))
.attr("y1", 0)
.attr("y2", h);

svg.append("line")
.attr("stroke-width", 1)
.attr("stroke", black)
.attr("x1", xScale(onTimeDeadline))
.attr("x2", xScale(onTimeDeadline))
.attr("y1", 0)
.attr("y2", h);

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
