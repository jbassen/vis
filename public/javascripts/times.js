//var _id = "3";
var ds = [];

//Width and height
var w = 1250;
var h = 750;
var p = 25; //padding

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
  if (data[i].exercise === _id) {
  //if (data[i].exercise !== 0) {
    ds.push(data[i]);
  }
}

//assign x-val for each username
var usernames = {};
var unique = 0;
for (var i=0; i<ds.length; i++) {
  if (i < ds.length - 1) {
    if (ds[i].username === ds[i+1].username) {
      continue;
    }
  }
  usernames[ds[i].username] = unique;
  unique += 1;
}


//scales
var xScale = d3.scale.linear()
.domain([
  d3.min(ds, function(d) { return d.timeMil; }),
  d3.max(ds, function(d) { return d.timeMil; })
])
.range([p, w - p]);

var yScale = d3.scale.linear()
.domain([0, d3.max(ds, function(d) { return usernames[d.username]; })])
.range([h - p, p]);


// add the canvas to the body of the webpage
var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h)
.attr("class", "axis")

// //axes
// svg.append("g")
// .call(d3.svg.axis()
//       .scale(xScale)
//       .orient("bottom")
// )
// .call(d3.svg.axis()
// .scale(yScale)
// .orient("left")
// )


//points
svg.selectAll("circle")
.data(ds)
.enter()
.append("circle")
.attr("cx", function(d) {
  return xScale(d.timeMil);
})
.attr("cy", function(d) {
  return yScale(usernames[d.username]);
})
.attr("r", 3)
.attr("fill", function(d) {
  if(d.isPassing === true) {
    return "green";
  } else if (d.willPass === true) {
    return "lightblue";
  } else {
    return "red";
  }
})

svg.append("line")
.attr("stroke-width", 1)
.attr("stroke", "black")
.attr("x1", xScale(earlyDeadline))
.attr("x2", xScale(earlyDeadline))
.attr("y1", yScale(0))
.attr("y2", yScale( d3.max( ds, function(d) { return usernames[d.username]; } ) ));

svg.append("line")
.attr("stroke-width", 1)
.attr("stroke", "black")
.attr("x1", xScale(onTimeDeadline))
.attr("x2", xScale(onTimeDeadline))
.attr("y1", yScale(0))
.attr("y2", yScale( d3.max( ds, function(d) { return usernames[d.username]; } ) ));


// //axes
// var xAxis = d3.svg.axis()
// .scale(xScale)
// .orient("bottom")
// .ticks(10);
//
// svg.append("g")
// .attr("class", "axis")
// .attr("transform", "translate(" + p + ",0)")
// .call(xAxis);

// svg.selectAll("text")
// .data(ds)
// .enter()
// .append("text")
// .text(function(d) {
//   return d.username;
// })
// .attr("x", function(d) {
//   return xScale(d.timeMil);
// })
// .attr("y", function(d) {
//   return yScale(usernames[d.username]);
// })
// .attr("font-family", "sans-serif")
// .attr("font-size", "11px")
// .attr("fill", "red");
