//var _id = "3";
var ds = [
0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0
];

//Width and height
var w = 1250;
var h = 750;
var p = 25; //padding
var bp = 1; //bar padding

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

//filter for a specific problem
for (var i=0; i<data.length; i++) {
  //if (data[i].exercise === _id && data[i].willPass === false) {
  if (data[i].exercise === _id) {
    //if (data[i].exercise !== 0) {
    var bin = data[i].bys;
    if ( bin < ds.length) {
      ds[bin] += 1;
    }
  }
}

//Create SVG element
var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h);

svg.selectAll("rect")
.data(ds)
.enter()
.append("rect")
.attr("x", function(d, i) {
  return i * (w / ds.length);
})
.attr("y", function(d) {
  return h - p - d;
})
.attr("width", w / ds.length - bp)
.attr("height", function(d) {
  return d;
})
.attr("fill", function(d) {
  return "rgb(0, 0, " + (d * 10) + ")";
});

svg.selectAll("text")
.data(ds)
.enter()
.append("text")
.text(function(d, i) {
  return i;
})
.attr("text-anchor", "middle")
.attr("x", function(d, i) {
  return i * (w / ds.length) + (w / ds.length - bp) / 2;
})
.attr("y", function(d) {
  return h - 10;
})
.attr("font-family", "sans-serif")
.attr("font-size", "11px")
.attr("fill", "black");
