(function () {
	// width, height, margins and padding
	var margin_bar = {top: -40, right: 30, bottom: 40, left: 200},
		width = 960 - margin_bar.left - margin_bar.right,
		height = 7500 - margin_bar.top - margin_bar.bottom;
	
	// scales
	var xScale = d3.scaleLinear()
		.range([0, width]);
		
	var yScale = d3.scaleBand()
		.rangeRound([0, height])
		//.rangeRoundBands([0, height])
		.paddingInner(0.1);
		
	var div = d3.select("#container").append("div")
    .attr("class", "tooltipbar")
    .style("opacity", 0);
		
	// load data
	d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/Team_minutes_stats.csv", type, function(error, data) {	
		
	
		console.log(data);
		
		data.sort(function(x, y){
			return d3.descending( x.Minutes, y.Minutes);
		})
		
		
		// domains
		xScale.domain(d3.extent(data, function(d) { return d.Total_Minutes; })).nice();
		yScale.domain(data.map(function(d) { return d.Club; }));
		
		// define X axis
		//var formatAsPercentage = d3.format("1.0%");

		var xAxis = d3.axisBottom()
							  .scale(xScale)
							  //.tickFormat(formatAsPercentage);
								
		// create svg
		var svg = d3.select("#container")
			.append("svg")
				.attr("width", width + margin_bar.left + margin_bar.right)
				.attr("height", height + margin_bar.top + margin_bar.bottom )
			.append("g")
				.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");
						
		
		// format tooltip
		var thsndFormat = d3.format(",");
				var tickNeg = svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + xScale(0) + ",0)")
				.call(d3.axisLeft(yScale))
			.selectAll(".tick")
			.filter(function(d, i) { return data[i].Minutes < 0; });
		
		tickNeg.select("line")
			.attr("x2", 6);
			
		tickNeg.select("text")
			.attr("x", 9)
			.style("text-anchor", "start");	
			
		

		
		// create  bars
	var bars = 	svg.selectAll(".bar")
			.data(data)
			.enter()			
			.append("rect")
				.attr("class", function(d) { return "bar bar--" + ("positive"); })
				.attr("y", function(d) { return yScale(d.Club); })
				.attr("height", yScale.bandwidth() - 1)
				.attr("x",  d => { return width; })
				.attr("width", 0) //function(d) { return Math.abs(xScale(d.Minutes) - xScale(0)); })
			bars.transition()
				.duration(100)
				.delay(function (d, i) {
							return i * 20;
							})
				.attr("x", function(d) { return xScale(Math.min(0, d.Total_Minutes)); })
				.attr("width", function(d) { return Math.abs(xScale(d.Total_Minutes) - xScale(0)); })	
							
				
				
				
			// tooltip
			bars.on("mouseover", function(d) {
				d3.select(this).style("fill", function() {
					return d3.rgb(d3.select(this).style("fill")).darker(0.99);
					});
				div.transition()
				 .duration(200)
         .style("opacity", 1.0);
				div.html("Players for "d.Club + " have amassed " + d.Total_Minutes + " minutes played since August 2015.")
        .style("left", (d3.event.pageX ) + 10 + "px")
        .style("top", (d3.event.pageY) + 30 + "px");
        //.style("height",  60 + "px");
			})
			
			bars.on("mouseout", function(d) {
				d3.select(this).style("fill", function() {
					return d3.rgb(d3.select(this).style("fill")).brighter(0.99);
					});
        div.transition()
					.duration(500)
					.style("opacity", 0);
      });
      
      /*
      	var labels = svg.selectAll(".label")        
		        .data(data)
		        .enter()
		        .append("text")
		        .attr("class", "label")
		        .style("display",  d => { return d.Minutes === null ? "none" : null; })
		        .attr("y", ( d => { return y(d.Player) + (y.bandwidth() / 2) -8 ; }))
		            .style("fill",  d => { 
		                return d.Minutes === d3.max(data,  d => { return d.Minutes; }) 
		                ? highlightColor : greyColor
		                })
		        .attr("x",  d => { return width; })
		            .attr("width", 0)
		                .transition()
		                .duration(750)
		                .delay((d, i) => { return i * 150; })
		        .text( d => { return d.Minutes; })
		        .attr("x",  d => { return x(d.Minutes) + .1; })
		        .attr("dx", "-.7em"); 
		*/        
			 
		//svg.append("g")
		//	.attr("class", "x axis")
		//	.attr("transform", "translate(0," + height + ")")  
		//	.call(xAxis);					 
			
		// add tickNegative	
		
		});
		
function type(d) {
  d.Total_Minutes = +d.Total_Minutes;
  return d;
}
})()
