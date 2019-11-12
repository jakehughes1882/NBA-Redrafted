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
var xValue = function(d) { return d.OverallRank;}, // data -> value
    xScale = d3.scaleLinear().range([50, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);

// setup x team
var xValueTeam = function(d) { return d.TeamAverageRank;}, // data -> value
    xScale = d3.scaleLinear().range([50, width]), // value -> display
    xMapTeam = function(d) { return xScale(xValueTeam(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);

// setup x college  
var xValueCollege = function(d) { return d.CollegeAverageRank;}, // data -> value
    xScale = d3.scaleLinear().range([50, width]), // value -> display
    xMapCollege = function(d) { return xScale(xValueCollege(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);   
        
// setup y
var yValue = function(d) { return d.OverallReDraft;}, // data -> value
    yScale = d3.scaleLinear().range([height, -150]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale);
    
// setup y team
var yValueTeam = function(d) { return d.TeamAverageRerank;}, // data -> value
    yScale = d3.scaleLinear().range([height, -150]), // value -> display
    yMapTeam = function(d) { return yScale(yValueTeam(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale);
    
// setup y college
var yValueCollege = function(d) { return d.CollegeAverageRerank;}, // data -> value
    yScale = d3.scaleLinear().range([height, -150]), // value -> display
    yMapCollege = function(d) { return yScale(yValueCollege(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale);        

//var firstroundpick = function(d) {return d.OverallRank};
var roundPicked = function(d) { return (d.OverallRank <31) ? 1:0; };

//set Team circle radius
var rValueTeam = function(d) { return d.TeamPicks;};
	rScale = d3.scaleLog().range([4, 12]),
	rMapTeam = function(d) { return rScale(rValueTeam(d));}


//set College circle radius
var rValueCollege = function(d) { return d.CollegePicks;};
	rScale = d3.scaleLog().range([4, 12]),
	rMapCollege = function(d) { return rScale(rValueCollege(d));}

// setup fill color
var cValue = function(d) { return d.Team;},
    color = d3.scaleOrdinal(d3.schemeCategory20b);
    
var cValueCollege = function(d) { return d.College;},
    color = d3.scaleOrdinal(d3.schemeCategory20b);    




var NBA_Player = function(d) { return d.Player;};
var PlayerOverallRank = function(d) { return d.OverallRank;};
var PlayerYearDrafted = function(d) { return d.YearDrafted;};
var PlayerOverallReRank = function(d) { return d.OverallReDraft;};
var PlayerRankDeficit = function(d) { return d.RankDeficit;};


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
d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/NBADraftPicks_scatter.csv", function(error, data) {

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
            "translate(" + (width - 300) + " ," + 
                           (height + margin.top + 30) + ")")
      .style("text-anchor", "middle")
      .text("Overall Pick");  

  // y-axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50 - margin.left)
      .attr("x", 60 - (height/1.5))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Re-drafted pick");   
      
      

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
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
	      
	      d3.select(this).style("fill", function() {
					return d3.rgb(d3.select(this).style("fill")).darker(0.99);
					});
		  			
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.Player + " was drafted " + d.OverallRank + " overall in " + d.YearDrafted + " and is redrafted at " + 
          d.OverallReDraft + ", giving a total of " + d.RankDeficit + " places moved for his draft year.") 
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

	
var placeholders = document.querySelectorAll(".placeholderText > p")
	
	
window.addEventListener("scroll", function(e) {
    
    
	var last;
	for (var placeholder of placeholders) { 
		var top = placeholder.getBoundingClientRect().top
		if (top < 0 )
			{
			last = placeholder	
			}
		}
	//console.log(scrollY)
		
	if (last.id === "P1") {
    		
			xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
			
			svg.select(".x.axis")
		    	.transition()
		    	.duration(1000)
		    	.call(xAxis);
		    		
			svg.selectAll(".dot")
				.transition()
				.duration(1000)
				.attr("cx", xMap)
				.attr("cy", yMap)
				.attr("opacity", 1)
				.attr("r", 3.5)
				.style("fill", function(d) { return color(cValue(d));}) 
			svg.selectAll(".dot")		
				.on("mouseover", function(d) {
				d3.select(this).style("fill", function() {
					return d3.rgb(d3.select(this).style("fill")).darker(0.99);
					});
		          tooltip.transition()
		               .duration(200)
		               .style("height", "70px")
		               .style("opacity", 1);
		          tooltip.html(d.Player + " was drafted " + d.OverallRank + " overall in " + d.YearDrafted + " and is redrafted at " + 
		          d.OverallReDraft + ", giving a total of " + d.RankDeficit + " places moved for his draft year.") 
		               .style("left", (d3.event.pageX) + "px")
		               .style("top", (d3.event.pageY - scrollY) + "px")
				       console.log(d3.event.pageX)  
					   console.log(d3.event.pageY)		                     
		          });
		}
		
			
		
	if (last.id === "P2") {		
			xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)/2+1]);
			
			svg.select(".x.axis")
				.transition()
				.duration(1000)
				.call(xAxis);
			svg.selectAll(".dot")
				.transition()
				.duration(1000)
				.attr("cx", xMap)
				.attr("cy", yMap)
				.attr("opacity", roundPicked)
				.attr("r", 3.5)
				.style("fill", function(d) { return color(cValue(d));}) 
			svg.selectAll(".dot")		
				.on("mouseover", function(d) {
				d3.select(this).style("fill", function() {
					return d3.rgb(d3.select(this).style("fill")).darker(0.99);
					});	
				//console.log(d.Player)
				//console.log(tooltip)
			      tooltip.transition()
			           .duration(200)
			           .style("height", "70px")
			          .style("opacity", 1);
			      tooltip.html(d.Player + " was drafted " + d.OverallRank + " overall in " + d.YearDrafted + " and is redrafted at " + 
			      d.OverallReDraft + ", giving a total of " + d.RankDeficit + " places moved for his draft year.") 
			           .style("left", (d3.event.pageX) + "px")
			           .style("top", (d3.event.pageY - scrollY) + "px") 
			           });
		}
				
		
		if (last.id === "P3") {
				  svg.selectAll(".dot")	
						.transition()
						.duration(1000)
						.attr("cx",xMapTeam)
						.attr("cy", yMapTeam)
						.attr("opacity", 0.3)
						.attr("r", rMapTeam)
						.style("fill", function(d) { return color(cValue(d));}) 
				svg.selectAll(".dot")	
					.on("mouseover", function(d) {
						d3.select(this).style("fill", function() {
							return d3.rgb(d3.select(this).style("fill")).darker(0.99);
							});	
				          tooltip.transition()
				               .duration(200)
				               .style("height", "85px")
				               .style("opacity", 1);
				          tooltip.html(d.Team + " have drafted " + d.TeamPicks + " first round picks, with an average pick of " + d.TeamAverageRank + " and an average redraft value of " + 
				          d.TeamAverageRerank + ", giving a total of " + d.TeamRankDeficit + " places moved.")//.toFixed(1)
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
		}
				
		if (last.id === "P4") {	
				svg.select(".x.axis")
					.transition()
					.duration(1000)
					.call(xAxis);
				  
				svg.selectAll(".dot")
					.transition()
					.duration(1000)
					.attr("cx", xMap)
					.attr("cy", yMap)
					.attr("opacity", roundPicked)
					.attr("r", 3.5)
					.style("fill", function(d) { return color(cValue(d));}) 
				svg.selectAll(".dot")		
					.on("mouseover", function(d) {
					d3.select(this).style("fill", function() {
						return d3.rgb(d3.select(this).style("fill")).darker(0.99);
						});	
				      tooltip.transition()
				           .duration(200)
				           .style("height", "70px")
				           .style("opacity", 1);
				      tooltip.html(d.Player + " was drafted " + d.OverallRank + " overall in " + d.YearDrafted + " and is redrafted at " + 
				      d.OverallReDraft + ", giving a total of " + d.RankDeficit + " places moved for his draft year.") 
				           .style("left", (d3.event.pageX) + "px")
				           .style("top", (d3.event.pageY - scrollY) + "px") });
		}		
			
		if (last.id === "P5") {
				svg.selectAll(".dot")
					//.transition()
					//.duration(1000)
					.style("fill", function(d) { return color(cValueCollege(d));}) 
				svg.selectAll(".dot")	
					.transition()
					.delay(1000)
					.duration(1000)
					.attr("cx", xMapCollege)
					.attr("cy", yMapCollege)
					.attr("opacity", 0.8)
					.attr("r", rMapCollege)
				svg.selectAll(".dot")		
					.on("mouseover", function(d) {
					  		d3.select(this).style("fill", function() {
						return d3.rgb(d3.select(this).style("fill")).darker(0.99);
						});		
			          tooltip.transition()
			               .duration(200)
			               .style("height", "108px")
			               .style("opacity", 1);
			          tooltip.html(d.College + " have had " + d.CollegePicks + " players drafted as first round picks, at an average pick of " + d.CollegeAverageRank + " and an average redraft value of " + 
			          d.CollegeAverageRerank + ", giving a total of " + d.CollegeRankDeficit + " places moved.") //.toFixed(1)
			               .style("left", (d3.event.pageX) + "px")
			               .style("top", (d3.event.pageY - scrollY) + "px") }); 
		}		

	});	
});
	
})()	