(function () {
	// width, height, margins and padding
	var margin_bar = {top: 10, right: 30, bottom: 40, left: 30},
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
	d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/NBADraftPicks_bar.csv", type, function(error, data) {	
		
		console.log(data);
		
		//data.sort(function(a,b) { return -a.RankDeficit - -b.RankDeficit })
		
		// domains
//		xScale.domain([-.23, .18]); // approximates values in csv
		xScale.domain(d3.extent(data, function(d) { return d.VORP_Deficit; })).nice();
		yScale.domain(data.map(function(d) { return d.Player; }));
		
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
		
		// create  bars
		svg.selectAll(".bar")
			.data(data)
			.enter()
			.append("rect")
				.attr("class", function(d) { return "bar bar--" + (d.VORP_Deficit < 0 ? "negative" : "positive"); })
				.attr("x", function(d) { return xScale(Math.min(0, d.VORP_Deficit)); })
				.attr("y", function(d) { return yScale(d.Player); })
				.attr("width", function(d) { return Math.abs(xScale(d.VORP_Deficit) - xScale(0)); })
				.attr("height", yScale.bandwidth() - 1)
				
			// tooltip
			.on("mouseover", function(d) {
				d3.select(this).style("fill", function() {
					return d3.rgb(d3.select(this).style("fill")).darker(0.99);
					});
				div.transition()
				 .duration(200)
         .style("opacity", 1.0);
				div.html(d.Player + " was drafted " + d.OverallRank + " by " + d.Team + " in " + d.YearDrafted + " and has a career VORP of " + d.VORP + ", redrafting him at " + d.OverallReDraft + " for his draft year. Comparing his original and redraft positions, " + d.Player + " has a VORP deficit of " + d.VORP_Deficit)
        .style("left", (d3.event.pageX ) + 10 + "px")
        .style("top", (d3.event.pageY) + 60 + "px");
        //.style("height",  60 + "px");
			})
			.on("mouseout", function(d) {
				d3.select(this).style("fill", function() {
					return d3.rgb(d3.select(this).style("fill")).brighter(0.99);
					});
        div.transition()
					.duration(500)
					.style("opacity", 0);
      });
			 
		//svg.append("g")
		//	.attr("class", "x axis")
		//	.attr("transform", "translate(0," + height + ")")  
		//	.call(xAxis);					 
			
		// add tickNegative
		var tickNeg = svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + xScale(0) + ",0)")
				.call(d3.axisLeft(yScale))
			.selectAll(".tick")
			.filter(function(d, i) { return data[i].VORP_Deficit < 0; });

		tickNeg.select("line")
			.attr("x2", 6);
			
		tickNeg.select("text")
			.attr("x", 9)
			.style("text-anchor", "start");		
		
		});
		
function type(d) {
  d.VORP_Deficit = +d.VORP_Deficit;
  return d;
}
})()
