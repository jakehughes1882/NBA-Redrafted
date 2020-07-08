(function () {
	// width, height, margins and padding
	var margin_bar = {top: 80, right: 20, bottom: 40, left: 20},
		width = 350 - margin_bar.left - margin_bar.right,
		height = 350 - margin_bar.top - margin_bar.bottom;
	
	// scales
	var xScale = d3.scaleLinear()
		.range([0, width]);
		
	var yScale = d3.scaleBand()
		.rangeRound([0, height])
		.paddingInner(0.1);
		
// load data
d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/RivalGameStatsAggregate.csv", function(error, data) {

 // change string (from CSV) into number format
  data.forEach(function(d) {
    d.SPG = +d.SPG;
  }); 		

// domains
xScale.domain(d3.extent(data, function(d) { return d.SPG; })).nice();
yScale.domain(data.map(function(d) { return d.DerbyFlag; }));

var xAxis = d3.axisBottom()
			  .scale(xScale)

var tooltip = d3.select("#container_kpi_to_bar_btts")
  .append("div")
  .style("position", "absolute")
  .attr("class", "tooltip")
  .style("text-align", "right")
  .style("width", "140px")
  .style("height", "40px")
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
    d3.select(this).style("fill", function() {
      return d3.rgb(d3.select(this).style("fill")).darker(0.99);
      });
  }
  var mousemove = function(d) {
    tooltip
      .html("Games with a derby rating of " + d.DerbyFlag + " on average produce " + (Math.round(d.SPG * 100))/100 + " goals per game.")
      .style("left", (d3.event.pageX + 30) + "px")
      .style("top", (d3.event.pageY - scrollY + 30) + "px");
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
    d3.select(this).style("fill", function() {
      return d3.rgb(d3.select(this).style("fill")).brighter(0.99);
      });  
  }

								
// create svg
var svg = d3.select("#container_kpi_to_bar_btts")
			.append("svg")
			.attr("width", width + margin_bar.left + margin_bar.right)
			.attr("height", height + margin_bar.top + margin_bar.bottom )
			.append("g")
			.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");					
		
			
var ColourMap = {'0': '#A3BE8C', '1': '#EBCB8B', '2': '#D08770', '3':"#BF616A"} 
var StringMap = {'0': 'No Rivalry', '1': 'Mild Rivalry', '2': 'Strong Rivalry', '3':"Extreme Rivalry"} 
		
// create  bars
var bars = 	svg.selectAll(".bar")
	 			.data(data)
				.enter()			
				.append("rect")
					.attr("class", "bar")
					.attr("rx", 6)
	                .attr("ry", 6)
					.attr("y", function(d) { return yScale(d.DerbyFlag); })
					.attr("height", yScale.bandwidth() - 1)
					.attr("fill", function(d) {return ColourMap[d.DerbyFlag]} )
					.attr("x", -15) //function(d) { return xScale(Math.min(0, d.SPG)); })
					.attr("width", 0)
					.on("mouseover", mouseover)
    				.on("mousemove", mousemove)
    				.on("mouseleave", mouseleave)	
	 
var labels = svg.selectAll("text")
			   .data(data)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return StringMap[d.DerbyFlag] + ": "+(Math.round(d.SPG * 100))/100;
			   })
			   .attr("text-anchor", "start")
			   .attr("y", function(d) { return yScale(d.DerbyFlag) + (yScale.bandwidth() - 1)/2; })
			   .attr("x", 20) //function(d) { return xScale(Math.min(0, d.SPG)) + 320; }   )
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")	
			   .attr("opacity", 0)
			   .attr("fill", "#08415C");

var kpi = svg.append("text").lower() 
             .attr("transform",
                 "translate(" + (width - 200) + " ," + 
                           (margin_bar.top  + 0) + ")")
             .style("text-anchor", "middle")
             .text("2.49")	
			 .attr("font-family", "sans-serif")
			 .attr("font-size", "62px")	
			 .attr("fill", "#08415C");

var kpi_secondary = svg.append("text").lower() 
             .attr("transform",
                 "translate(" + (width - 200) + " ," + 
                           (margin_bar.top  + 100) + ")")
             .style("text-anchor", "middle")
             .text("(2.72 in All Games)")	
			 .attr("font-family", "sans-serif")
			 .attr("font-size", "30px")	
			 .attr("fill", "#08415C");			 
		 		   

var titleaxis = svg.append("text")             
      .attr("transform",
            "translate(" + (width - 200) + " ," + 
                           (margin_bar.top  - 100) + ")")
      .style("text-anchor", "middle")
      .text("Goals Per Game")	
      .attr("font-family", "sans-serif")
			 .attr("font-size", "21px")	
			 .attr("fill", "#08415C");		   
			   

var placeholders = document.querySelectorAll(".placeholderText_kpi > p")
    
    
window.addEventListener("scroll", function(e) {
    
    
    var last;
    for (var placeholder of placeholders) { 
        var top = placeholder.getBoundingClientRect().top
        if (top < 0 )
            {
            last = placeholder  
            }
        }
    
    if (last.id === "P9") {	

    svg.selectAll(".bar")
			.transition()
				.attr("width", 0)
	labels.transition()
			.attr("opacity", 0)			
	kpi.transition()
				 .attr("opacity", 1)
	kpi_secondary.transition()
				 .attr("opacity", 1)			 				
	
			}

	if (last.id === "P10") {		

		svg.selectAll(".bar")
			.transition()
				.attr("width", function(d) { return xScale(d.SPG); })
		labels.transition()
				.attr("opacity", 1)		
		kpi.transition()
				 .attr("opacity", 0)
		kpi_secondary.transition()
				 .attr("opacity", 0)		 
				

			}


							
    		
	});
  });
})()
