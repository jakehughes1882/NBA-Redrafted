(function () {

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 680 - margin.left - margin.right + 30,
    height = 500 - margin.top - margin.bottom ;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x player
var xValue = function(d) { return (d.EPLPosition);}, // data -> value
    xScale = d3.scaleLinear().range([50, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);
        
// setup y
var yValue = function(d) { return ((d.ClubSquadSize - d.ClubSquadRetained + 0.0)/d.ClubSquadSize);}, // data -> value
    yScale = d3.scaleLinear().range([height, -150]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale);      

//var firstroundpick = function(d) {return d.OverallRank};
//var roundPicked = function(d) { return (d.OverallRank <31) ? 1:0; };



var Club = function(d) { return d.Club;};
var Season = function(d) { return d.Season;};
var SquadRetained = function(d) { return d.ClubSquadRetained;};
var SquadSize = function(d) { return d.ClubSquadSize;};
var Position = function(d) { return d.EPLPosition;};
var PositionDifference = function(d) { return d.EPLPosition_Difference;};


// add the graph canvas to the body of the webpage
var svg = d3.select("#scatter").append("svg")
    .attr("width", width + margin.left  + margin.right + 30)
    .attr("height", height + margin.top  + margin.bottom + 30)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 650 450")
    .classed("svg-content", true);
    
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#D8DEE9");

svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    

// add the tooltip area to the webpage
var tooltip = d3.select("#scatter").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/Team_squad_and_results.csv", function(error, data) {

  // change string (from CSV) into number format
//  data.forEach(function(d) {
//    d.OverallRank = +d.OverallRank;
//    d.RankDeficit = +d.RankDeficit;
//    console.log(d);
//  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width - 300) + " ," + 
                           (height + margin.top + 30) + ")")
      .style("text-anchor", "middle")
      .text("EPL Position");  

  // y-axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50 - margin.left)
      .attr("x", 60 - (height/1.5))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Squad Retention");   
      
    var ColourMap = {'Watford': '#fbf00a', 'Everton': '#003299', 'Newcastle United': '#000000', 'Southampton': '#d61a1f', 'Norwich': '#038842',
		 			 'Manchester City': '#65a5d3', 'Tottenham': '#10204b', 'Liverpool': '#d3151e', 'Chelsea': '#094595', 'West Ham': '#7c2c3a',
		 			 'Arsenal': '#ff0200', 'Brighton': '#1000fd', 'Crystal Palace': '#444678', 'Leicester': '#283d8a', 'Manchester United': '#d20222',
		 			 'Burnley': '#70193d', 'Wolverhampton Wanderers': '#fc891c', 'Sheffield United': '#f02329', 'Aston Villa': '#490024', 'Bournemouth': '#bf1014'
			}  
      

  // draw dots 
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("lineWidth", 0)
      //.attr("line : {width: 0}")
      //.style("fill", function(d) { return color(cValue(d));}) 
      .attr("fill", function(d) {return ColourMap[d.Club]} )
      .on("mouseover", function(d) {
	      
	      d3.select(this).style("fill", function() {
					return d3.rgb(d3.select(this).style("fill")).darker(0.99);
					});
		  			
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("During the " + d.Season + " season, " + d.Club + " finished in " + d.EPLPosition + " position, and that season retained " + 
          ((d.ClubSquadSize - d.ClubSquadRetained + 0.0)/d.ClubSquadSize)*100 + "% of their squad from the season prior.") 
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - scrollY) + "px");
        console.log(d3.event.pageX)  
        console.log(d3.event.pageY)
      })
      .on("mouseout", function(d) {
	      d3.select(this).style("fill", function() {
					return d3.rgb(d3.select(this).style("fill")).brighter(0.99);
					});
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
    });  