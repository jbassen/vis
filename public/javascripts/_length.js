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

console.log(data);

for (var username in data) {
  if(data[username][_id].length !== 0) {
    ds.push(
      { username: username,
        currentSteps: data[username][_id][0].currentSteps,
        timeTotal: data[username][_id][0].timeTotal,
        willPass: data[username][_id][0].willPass,
        timeString: data[username][_id][0].timeString
      }
    );
  }
}


var datas =
[0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0] //100

for (var i=0; i < ds.length; i++) {
  var currentSteps = ds[i].currentSteps.length;
  if(currentSteps > 9) {
    currentSteps = 9;
  }
  var bin = Math.floor(ds[i].timeTotal / 300000);
  if(bin > 9) {
    bin = 9;
  }
  datas[currentSteps * 10 + bin] += 1;
}

console.log(datas);

var yScale = d3.scale.linear()
.domain([0, 75])//d3.max(ds, function(d) { return d.timeTotal; })])
.range([h - p, p]);

// add the canvas to the body of the webpage
var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h)
.attr("class", "axis")

svg.selectAll("rect")
.data(datas)
.enter()
.append("rect")
.attr("x", function(d, i) {
  var currentSteps = Math.floor(i / 10);
  var bin = i - currentSteps;
  return (currentSteps * (w / 100)) + bin * (0.7 * (w / 100));
})
.attr("y", p)
.attr("width", 0.2 * (0.7 * (w / 100)))//xScale(.0002 * d.timeDelta)})
.attr("height", function(d,i) {
  console.log(d)
  return d * 5;
})
.attr("fill", function(d) {
  return darkblue;
})
.append("svg:title")
.text(function(d) { Math.floor(d / 10)  + "\n" + (i - Math.floor(d / 10));
});
