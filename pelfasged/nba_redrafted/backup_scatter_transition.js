/*
d3.select("#team").on("click", function() {

  //svg.append("text")             
  //    .attr("transform",
  //          "translate(" + (width - 410) + " ," + 
  //                         (height + margin.top + 30) + ")")
  //    .style("text-anchor", "middle")
  //    .text("Average"); 
	
  svg.selectAll(".dot")	
		.transition()
		.duration(1000)
		.attr("cx",xMapTeam)
		.attr("cy", yMapTeam)
		.attr("opacity", 0.3)
svg.selectAll(".dot")	
	.on("mouseover", function(d) {
		d3.select(this).style("fill", function() {
			return d3.rgb(d3.select(this).style("fill")).darker(0.99);
			});
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.Team + " have drafted " + d.TeamPicks + " first round picks, with an average pick of " + d.TeamAverageRank + " and an average redraft value of " + 
          d.TeamAverageRerank + ", giving a total of " + d.TeamRankDeficit + " places moved.")//.toFixed(1)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
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
*/

/*
d3.select("#college").on("click", function() {
	//CollegeRadius.domain([d3.min(data, rValueCollege), d3.max(data, rValueCollege)]);
	
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
               .style("opacity", .9);
          tooltip.html(d.College + " have had " + d.CollegePicks + " players drafted as first round picks, at an average pick of " + d.CollegeAverageRank + " and an average redraft value of " + 
          d.CollegeAverageRerank + ", giving a total of " + d.CollegeRankDeficit + " places moved.") //.toFixed(1)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px") });        
});
*/

/*
d3.select("#reset").on("click", function() {
	
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
	svg.selectAll(".dot")		
		.on("mouseover", function(d) {
		d3.select(this).style("fill", function() {
			return d3.rgb(d3.select(this).style("fill")).darker(0.99);
			});
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.Player + " was drafted " + d.OverallRank + " overall in " + d.YearDrafted + " and is redrafted at " + 
          d.OverallReDraft + ", giving a total of " + d.RankDeficit + " places moved for his draft year.") 
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px") });
});
*/

/*
d3.select("#filter").on("click", function() {
	
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
	svg.selectAll(".dot")		
		.on("mouseover", function(d) {
		d3.select(this).style("fill", function() {
			return d3.rgb(d3.select(this).style("fill")).darker(0.99);
			});	
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.Player + " was drafted " + d.OverallRank + " overall in " + d.YearDrafted + " and is redrafted at " + 
          d.OverallReDraft + ", giving a total of " + d.RankDeficit + " places moved for his draft year.") 
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px") });
});
*/
var colourMap  = {
	P1: "red",
	P2: "green",
	P3: "blue",
	P4: "yellow",
	P5: "black"
}