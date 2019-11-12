(function () {
// set the dimensions and margins of the graph
var margin_grid = {top: 80, right: 25, bottom: 30, left: 40},
  width = 550 - margin_grid.left - margin_grid.right,
  height = 1000 - margin_grid.top - margin_grid.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin_grid.left + margin_grid.right)
  .attr("height", height + margin_grid.top + margin_grid.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin_grid.left + "," + margin_grid.top + ")");

//Read the data
//d3.csv('/Users/jakehughes/Documents/PythonScripts/NBA/NBADraftPicks_test.csv', function(data) {
d3.csv('https://raw.githubusercontent.com/jakehughes1882/data/master/NBADraftPicks_grid.csv', function(data) {

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = d3.map(data, function(d){return d.YearDrafted;}).keys()
  var myVars = d3.map(data, function(d){return d.OverallRank;}).keys()

  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + 0 + ")")
    .call(d3.axisTop(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 14)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  var myColor = d3.scaleLinear()
      .domain([5,55])
      .range(['#A3BE8C','#BF616A'])
      .interpolate(d3.interpolateHcl);
    //.interpolator(d3.interpolateInferno)
    //.interpolate(d3.interpolateHcl)
    // .range([d3.rgb("#BF616A"), d3.rgb('#A3BE8C')]);
    //.domain([1,60])



    var tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("position", "absolute")
      .attr("class", "tooltip")
      .style("text-align", "right")
      .style("width", "140px")
      .style("height", "80px")
      .style("padding", "6px")
      .style("font", "12px sans-serif")
      .style("background", "white")
      .style("border", "1px solid lightgray")
      .style("border-radius", "8px")
      .style("pointer-events", "none")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html(d.Player + " was drafted " + d.OverallRank + " by " + d.Team + " in " + d.YearDrafted + " and has a career VORP of " + d.VORP + ", redrafting him at " + d.OverallReDraft + " for his draft year.")
        .style("left", (d3.event.pageX ) + 10 + "px")
        .style("top", (d3.event.pageY) + 60 + "px");
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  svg.selectAll()
    .data(data, function(d) {return d.YearDrafted+':'+d.OverallRank;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.YearDrafted) })
      .attr("y", function(d) { return y(d.OverallRank) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.OverallReDraft)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})

// Add title to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "center")
        //.style("text-align, center")
        .style("font-size", "22px")
        .text("NBA Draft Picks From 2008 - 2018");

// Add subtitle to graph
//svg.append("text")
//        .attr("x", 0)
//        .attr("y", -20)
//        .attr("text-anchor", "cennter")
//        .style("font-size", "14px")
//        .style("fill", "grey")
//        .style("max-width", 400)
//        .text("Player performances against their drafted position.");
})()        