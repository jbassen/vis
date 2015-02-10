//var _id = "3";
var dataset = [];

var ds = [
0,0,0,0,0,0,0,0,0,0,
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
  if (data[i].exercise === _id) {
    //if (data[i].exercise !== 0) {
    dataset.push(data[i]);
  }
}

//assign x-val for each username
var usernames = {};
for (var i=0; i<dataset.length; i++) {
  if ( usernames.hasOwnProperty(dataset[i].username) ) {
    if ( dataset[i].delta < 300000 ) {
      usernames[dataset[i].username] += dataset[i].delta;
    } else {
      usernames[dataset[i].username] += 300000;
    }
  } else {
    usernames[dataset[i].username] = 300000;
  }
}

for (var key in usernames) {
  if (usernames.hasOwnProperty(key)) {
    console.log(usernames[key]);
    var bin = (usernames[key] - (usernames[key] % 300000)) / 300000;
    if ( bin < ds.length) {
      ds[bin] += 1;
    }
  }
}

console.log(ds);

// _.forEach(usernames, function(val, username) {
//   var bin = (val - (val % 300000)) / 300000;
//   if ( bin < ds.length) {
//     ds[bin] += 1;
//   }
// });

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
  return (h - p - d * 4);
})
.attr("width", w / ds.length - bp)
.attr("height", function(d) {
  return d * 4;
})
.attr("fill", function(d) {
  return "rgb(0, 0, " + (d * 10) + ")";
});

svg.selectAll("text")
.data(ds)
.enter()
.append("text")
.text(function(d, i) {
  return i * 5;
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
