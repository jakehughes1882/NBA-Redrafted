(function () {
	// width, height, margins and padding
	var margin_bar = {top: 20, right: 30, bottom: 40, left: 200},
		width = 560 - margin_bar.left - margin_bar.right,
		height = 250 - margin_bar.top - margin_bar.bottom;
	
	// scales
	var xScale = d3.scaleLinear()
		.range([0, width]);

	var xScaleSPG = d3.scaleLinear()
		.range([0, width]);	
		
	var yScale = d3.scaleBand()
		.rangeRound([0, height])
		//.rangeRoundBands([0, height])
		.paddingInner(0.1);
		
	var div = d3.select("#HarryKanePLBar").append("div")
    .attr("class", "tooltipbar")
    .style("opacity", 0);
		
	// load data
	d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/HarryKanePL.csv", type, function(error, data) {	
		
		  data.forEach(function(d) {
		    d.seasonkey = +d.seasonkey;
		    d.goals = +d.goals;
		    d.assists = +d.assists;
		    d.SPG = +d.SPG;
		  }); 
	
		console.log(data);
		
		data.sort(function(x, y){
			return d3.descending( x.seasonkey, y.seasonkey);
		})
		
		
		// domains
		xScale.domain(d3.extent(data, function(d) { return d.goals; })).nice();
		//xScale.range([0, width-500]);
		yScale.domain(data.map(function(d) { return d.season; }));
		
		// define X axis
		//var formatAsPercentage = d3.format("1.0%");

		var xAxis = d3.axisBottom()
							  .scale(xScale)
							  //.tickFormat(formatAsPercentage);
								
		// create svg
		var svg = d3.select("#HarryKanePLBar")
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
			.filter(function(d, i) { return data[i].goals < 0; });
		
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
				.attr("rx", 6)
				.attr("ry", 6)
				.attr("class", function(d) { return "bar bar--" + ("positive"); })
				.attr("y", function(d) { return yScale(d.season); })
				.attr("height", yScale.bandwidth() - 1)
				.attr("x",  d => { return width; })
				.attr("width", 0) //function(d) { return Math.abs(xScale(d.Minutes) - xScale(0)); })
				.attr("fill", '#10204b')
			bars.transition()
				.duration(100)
				.delay(function (d, i) {
							return i * 20;
							})
				.attr("x", function(d) { return xScale(Math.min(0, d.goals)); })
				.attr("width", function(d) { return Math.abs(xScale(d.goals) - xScale(0)); })
						
			// tooltip
			bars.on("mouseover", function(d) {
				d3.select(this).style("fill", function() {
					return d3.rgb(d3.select(this).style("fill")).darker(0.99);
					});
				div.transition()
				 .duration(200)
         .style("opacity", 1.0);
				div.html("In the " + d.season + " season, Dele Alli scored " + d.goals + ", made " + d.assists + " assists, and averaged " + d.SPG + " shots per game.")
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
      
      
    d3.select("#GoalsHK").on("click", function() {
	    
		// domains
		xScale.domain(d3.extent(data, function(d) { return d.goals; })).nice(); 
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
				.attr("x", function(d) { return xScale(Math.min(0, d.goals)); }) //function(d) { return xScale(Math.min(0, d.Total_Minutes_11)); })
				.attr("width", function(d) { return Math.abs(xScale(d.goals) - xScale(0)); })	

			});
			

	d3.select("#SPGHK").on("click", function() {
	    
		// domains
		xScaleSPG.domain(d3.extent(data, function(d) { return d.SPG; })).nice();  
	
		// create  bars
		svg.selectAll(".bar")
	    	.transition()	
	    		.attr("x",  d => { return 0; })
				.attr("width", 0)
				.transition()			
				//.attr("y", function(d) { return yScale(d.Club); })
				//.attr("height", yScale.bandwidth() - 1)
				//.attr("x", function(d) { return xScale(Math.min(0, d.Minutes_Deviation)); })
				.attr("x", function(d) { return xScale(Math.min(0, d.SPG)); })
				.attr("width", function(d) { return Math.abs(xScaleSPG(d.SPG) - xScaleSPG(0))/1.7; })	

		});			
      
	});       
		
function type(d) {
    d.seasonkey = +d.seasonkey;
    d.goals = +d.goals;
    d.assists = +d.assists;
    d.SPG = +d.SPG;
  return d;
}
})()
