var _id = 9;
var ds = [];

//Width and height
var w = 1600;
var h = 1200;

//filter for a specific problem
for (var i=0; i<data.length; i++) {
  if (data[i].exercise === 9) {
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

// add the canvas to the body of the webpage
var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h)




.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//scales
var xScale = d3.scale.linear()
.domain([
  d3.min(dset, function(d) { return d.timeMil; }),
  d3.max(dset, function(d) { return d.timeMil; })
  ])
  .range([0, w]);

  var yScale = d3.scale.linear()
  .domain([0, d3.max(dset, function(d) { return usernames[d.username]; })])
  .range([0, h]);
