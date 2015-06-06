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
var h = 720;
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
var usernames = {};

console.log(data);

for (var username in data) {
  if(data[username][_id].length !== 0) {
    ds.push(
      { username: username,
        breaksOverTime: data[username][_id][0].breaksOverTime,
        timeTotal: data[username][_id][0].timeTotal,
        willPass: data[username][_id][0].willPass,
        timeString: data[username][_id][0].timeString
      }
    );
  }
}

//scales
var xScale = d3.scale.linear()
.domain([0, d3.max(ds, function(d) { return d.breaksOverTime; })])
.range([p, w - p]);

var yScale = d3.scale.linear()
.domain([0, 10000000])//d3.max(ds, function(d) { return d.timeTotal; })])
.range([h - p, p]);


// add the canvas to the body of the webpage
var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h)
.attr("class", "axis")

//points
svg.selectAll("circle")
.data(ds)
.enter()
.append("circle")
.attr("cx", function(d) {
  return xScale(d.breaksOverTime);
})
.attr("cy", function(d) {
  return yScale(d.timeTotal);
})
.attr("r", 4)
.attr("fill", function(d) {
  if (d.willPass === true) {
    return darkblue;
  } else {
    return orange;
  }
})
.append("svg:title")
.text(function(d) { return d.username + "\n" + d.breaksOverTime  + "\n" + d.timeTotal; });
