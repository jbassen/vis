// var flags = {};
// flags[username] = [[],[],[],[],[]];
// flagBoxes[username] = {};
// // for each step
// for(var l=0; l<data[username][id][k].currentSteps.length; l++) {
//
//   // add flags data
//   flags[username][j].push(
//     {
//       username: data[username][id][k].username,
//       exercise: data[username][id][k].exercise,
//       timeMillis: data[username][id][k].timeMillis,
//       timeString: data[username][id][k].timeString,
//       timeDelta: data[username][id][k].timeDelta,
//       timeSum: data[username][id][k].timeSum,
//       timeTotal: data[username][id][k].timeTotal,
//       isPassing: data[username][id][k].isPassing,
//       status: data[username][id][k].status,
//       attempt: data[username][id][k].attempt,
//       willAttempt: data[username][id][k].willAttempt,
//       willPass: data[username][id][k].willPass,
//       currentGoal: data[username][id][k].currentRule,
//       currentStep: data[username][id][k].currentSteps[l],
//       stepStatus: data[username][id][k].stepStatuses[l],
//       stepNo: l
//     }
//   );
//
// } // end step



// var used = {"obvious": false,
// "renaming": false,
// "distribForallAnd": false,
// "distribExistsOr": false,
// "distribForallOr": false,
// "distribExistsAnd": false,
// "deMorganForall": false,
// "deMorganExists": false,
// "quantElim": false,
// "quantReorder": false,
// "distribAndOr": false,
// "distribOrAnd": false,
// "deMorganAnd": false,
// "deMorganOr": false,
// "andIdentity": false,
// "orIdentity": false,
// "impliesOr": false,
// "bicondImplies": false,
// "andDomination": false,
// "orDomination": false,
// "andIdempotence": false,
// "orIdempotence": false,
// "andInverse": false,
// "orInverse": false
// }

//console.log(used);


// svg.selectAll("rect")
// .data(ds)
// .enter()
// .append("rect")
// .attr("x", function(d) {
//   return (d.subCount * (rWidth + xSpace)) + p;
// })
// .attr("y", function(d) {
//   return (d.stepCount * (ySpace + rHeight)) + p;
// })
// .attr("width", rWidth)
// .attr("height", rHeight)
// .attr("fill", function(d) {
//   return ruleFills[d.currentStep];
// })
// .append("svg:title")
// .text(function(d) { return d.username + "\n" + d.currentStep + "\n" + (d.timeDelta / 1000) + "\n" +  (d.timeTotal / 1000) + "\n" + d.isPassing + "\n" + d.timeString});
//
// svg.selectAll("line")
// .data(ds)
// .enter()
// .append("line")
// .attr("stroke-width", sWidth)
// .attr("stroke", function(d) {
//   return ruleStrokes[d.currentStep];
// })
// .attr("x1", function(d) {
//   return (d.subCount * (rWidth + xSpace)) + p;
// })
// .attr("x2", function(d) {
//   return (d.subCount * (rWidth + xSpace)) + p + rWidth;
// })
// .attr("y1", function(d) {
//   return (d.stepCount * (ySpace + rHeight)) + p;
// })
// .attr("y2", function(d) {
//   return (d.stepCount * (ySpace + rHeight)) + p + rHeight;
// })
//
//
// svg.selectAll("ellipse")
// .data(ds)
// .enter()
// .append("ellipse")
// .attr("fill", white)
// .attr("cx", function(d) {
//   if(d.stepStatus === "bad") {
//     return (d.subCount * (rWidth + xSpace)) + p + (rWidth / 2);
//   }
// })
// .attr("cy", function(d) {
//   if(d.stepStatus === "bad") {
//     return (d.stepCount * (ySpace + rHeight)) + p + (rHeight / 2);
//   }
// })
// .attr("rx", function(d) {
//   if(d.stepStatus === "bad") {
//     return rWidth / 4;
//   }
// })
// .attr("ry", function(d) {
//   if(d.stepStatus === "bad") {
//     return rHeight / 4;
//   }
// })
//
// // svg.selectAll("text")
// // .data(ordering)
// // .enter()
// // .append("text")
// // .text(function(d) {
// //   return d.username;
// // })
// // .attr("text-anchor", "end")
// // .attr("x", 50)
// // .attr("y", function(d) {
// //   console.log("" + p + ", " + yScale(d.order))
// //   return yScale(d.order);
// // })
// // .attr("font-family", "sans-serif")
// // .attr("font-size", "11px")
// // .attr("fill", "black");


// _.forEach(data[username], function(id_obj, id) {
//   var mostSteps = 0;
//   for(var sub=0; sub<data[username][id].length; sub++) {
//     if(data[username][id][sub].currentSteps.length > mostSteps) {
//       mostSteps = data[username][id][sub].currentSteps.length;
//     }
//   }
//
//   if(data[username][id].length > maxSubs) {
//     maxSubs = data[username][id].length;
//   }
//   if(mostSteps > maxSteps) {
//     maxSteps = mostSteps;
//   }
//
//   // totalBoxes += exerciseBoxes;
//   // totalBoxes += statTimeBoxes;
//   // totalBoxes += statusBoxes;
//   flagBoxes[username][id] = mostSteps + 2;
//   totalBoxes += mostSteps + 2;
//
// });
