(function () {

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom - 20;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x player
var xValue = function(d) { return d.OverallRank;}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);  
        
// setup y
var yValue = function(d) { return d.RankDeficit;}, // data -> value
    yScale = d3.scaleLinear().range([height-10, 100]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale);
          

// setup fill color
var cValue = function(d) { return d.Team;},
    color = d3.scaleOrdinal(d3.schemeCategory20b);

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left  + margin.right + 30)
    .attr("height", height + margin.top  + margin.bottom + 30)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#D8DEE9");

svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/NBADraftPicks_Team.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.OverallRank = +d.OverallRank;
    d.RankDeficit = +d.RankDeficit;
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);


  // x-axis 
  svg.append("text")             
      .attr("transform",
            "translate(" + (width - 1490) + " ," + 
                           (height + margin.top + 30) + ")")
      .style("text-anchor", "left")
      .text("Overall Pick");  

  // y-axis  
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50 - margin.left)
      .attr("x", 30 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Redraft Position");   
      
      

  // draw dots 
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.Player + " was drafted " + d.OverallRank + " overall in " + d.YearDrafted + " and is redrafted at " + 
          d.OverallReDraft + ", giving a total of " + d.RankDeficit + " places moved for his draft year.") //.toFixed(1)
          //tooltip.html(d.Team + " have drafted " + d.count + " first round picks, with an average pick of " + d.OverallRank + " and an average redraft value of " + 
          //d.OverallReDraft + ", giving a total of " + d.RankDeficit + " places moved.") //.toFixed(1)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

});
	



//    <circle class="dot" r="3.5" cx="590.1639344262295" cy="183.73831775700936" style="fill: rgb(140, 162, 82);"></circle>
//	  <circle class="dot" r="3.5" cx="15300" cy="5860" style="fill: rgb(140, 162, 82);"></circle>

	
})()	