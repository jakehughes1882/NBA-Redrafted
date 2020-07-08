(function () {
	// width, height, margins and padding
	var margin_bar = {top: 20, right: 30, bottom: 40, left: 500},
		width = 860 - margin_bar.left - margin_bar.right,
		height = 500 - margin_bar.top - margin_bar.bottom;
	
	// scales
	var xScale = d3.scaleLinear()
		.range([0, width]);
		
	var yScale = d3.scaleBand()
		.rangeRound([0, height])
		//.rangeRoundBands([0, height])
		.paddingInner(0.1);
		
	var div = d3.select("#container_team_bar").append("div")
    .attr("class", "tooltipbar")
    .style("opacity", 0);
		
	// load data
	d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/Team_minutes_stats_updated.csv", type, function(error, data) {	
		
		  data.forEach(function(d) {
		    d.Total_Minutes = +d.Total_Minutes;
		    d.Total_Minutes_11 = +d.Total_Minutes_11;
		    d.Minutes_Deviation = +d.Minutes_Deviation;
		  }); 
	
		console.log(data);
		
		data.sort(function(x, y){
			return d3.descending( x.Total_Minutes, y.Total_Minutes);
		})
		
		
		// domains
		xScale.domain(d3.extent(data, function(d) { return d.Total_Minutes; })).nice();
		//xScale.range([0, width-500]);
		yScale.domain(data.map(function(d) { return d.Club; }));
		
		// define X axis
		//var formatAsPercentage = d3.format("1.0%");

		var xAxis = d3.axisBottom()
							  .scale(xScale)
							  //.tickFormat(formatAsPercentage);
								
		// create svg
		var svg = d3.select("#container_team_bar")
			.append("svg")
				.attr("width", width + margin_bar.left + margin_bar.right )
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
			.filter(function(d, i) { return data[i].Total_Minutes < 0; });
		
		tickNeg.select("line")
			.attr("x2", 6);
			
		tickNeg.select("text")
			.attr("x", 9)
			.style("text-anchor", "start");	
			
	var ColourMap = {'Watford': '#fbf00a', 'Everton': '#003299', 'Newcastle United': '#000000', 'Southampton': '#d61a1f', 'Norwich': '#038842',
		 			 'Manchester City': '#65a5d3', 'Tottenham': '#10204b', 'Liverpool': '#d3151e', 'Chelsea': '#094595', 'West Ham': '#7c2c3a',
		 			 'Arsenal': '#ff0200', 'Brighton': '#1000fd', 'Crystal Palace': '#444678', 'Leicester': '#283d8a', 'Manchester United': '#d20222',
		 			 'Burnley': '#70193d', 'Wolverhampton Wanderers': '#fc891c', 'Sheffield United': '#f02329', 'Aston Villa': '#490024', 'Bournemouth': '#bf1014'
	}	

		
		// create  bars
	var bars = 	svg.selectAll(".bar")
			.data(data)
			.enter()			
			.append("rect")
				.attr("rx", 6)
				.attr("ry", 6)
				.attr("class", function(d) { return "bar bar--" + ("positive"); })
				.attr("y", function(d) { return yScale(d.Club); })
				.attr("height", yScale.bandwidth() - 1)
				.attr("x",  d => { return width; })
				.attr("width", 0) //function(d) { return Math.abs(xScale(d.Minutes) - xScale(0)); })
				.attr("fill", function(d) {return ColourMap[d.Club]} )
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
				div.html("Players for " + d.Club + " have amassed " + d.Total_Minutes + " minutes played since August 2015. " + d.Total_Minutes_11 + " Minutes played by the most used 11.")
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
      
      

    
   
    d3.select("#Total11").on("click", function() {
	    
		// domains
		xScale.domain(d3.extent(data, function(d) { return d.Total_Minutes_11; })).nice(); 
		//xScale.range([0, width-300]);
		var xAxis = d3.axisBottom()
							  .scale(xScale)
	
		// create  bars
		svg.selectAll(".bar")
	    	.transition()
	    		.attr("x",  d => { return 0; })
				.attr("width", 0)
				.transition()		
				//.attr("y", function(d) { return yScale(d.Club); })
				//.attr("height", yScale.bandwidth() - 1)
					.attr("x", -330) //function(d) { return xScale(Math.min(0, d.Total_Minutes_11)); })
					.attr("width", function(d) { return Math.abs(xScale(d.Total_Minutes_11) + 330); })	

			});
			
	d3.select("#Total").on("click", function() {
	    
		// domains
		xScale.domain(d3.extent(data, function(d) { return d.Total_Minutes; })).nice();  
		//xScale.range([0, width-300]);  
		var xAxis = d3.axisBottom()
					  .scale(xScale)  
	
		// create  bars
		svg.selectAll(".bar")
	    	.transition()	
	    		.attr("x",  d => { return 0; })
				.attr("width", 0)
				.transition()			
				//.attr("y", function(d) { return yScale(d.Club); })
				//.attr("height", yScale.bandwidth() - 1)
				.attr("x", function(d) { return xScale(Math.min(0, d.Total_Minutes)); })
				.attr("width", function(d) { return Math.abs(xScale(d.Total_Minutes) - xScale(0)); })	

		});

	d3.select("#StDev").on("click", function() {
	    
		// domains
		xScale.domain(d3.extent(data, function(d) { return d.Minutes_Deviation; })).nice();  
		//xScale.range([0, width-300]);  
		var xAxis = d3.axisBottom()
					  .scale(xScale)  
	
		// create  bars
		svg.selectAll(".bar")
	    	.transition()	
	    		.attr("x",  d => { return 0; })
				.attr("width", 0)
				.transition()			
				//.attr("y", function(d) { return yScale(d.Club); })
				//.attr("height", yScale.bandwidth() - 1)
				//.attr("x", function(d) { return xScale(Math.min(0, d.Minutes_Deviation)); })
				.attr("x", -333)
				.attr("width", function(d) { return Math.abs(xScale(d.Minutes_Deviation) - xScale(0)); })	

		});			
      
	});       
		
function type(d) {
  d.Total_Minutes = +d.Total_Minutes;
  return d;
}
})()
