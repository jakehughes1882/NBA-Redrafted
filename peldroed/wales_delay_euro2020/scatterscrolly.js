(function () {

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 680 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.AverageAge;}, // data -> value
    xScale = d3.scaleLinear().range([50, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);

// setup y
var xValueWA = function(d) { return d.WeightedAverageAge;}, // data -> value
    xScaleWA = d3.scaleLinear().range([50, width]), // value -> display
    xMapWA = function(d) { return xScaleWA(xValueWA(d));}, // data -> display
    xAxisWA = d3.axisBottom().scale(xScaleWA); 

var xValueDP = function(d) { return (d.DribbledPast/d.Minutes);}, // data -> value
    xScaleDP = d3.scaleLinear().range([50, width]), // value -> display
    xMapDP = function(d) { return xScaleDP(xValueDP(d));}, // data -> display
    xAxisDP = d3.axisBottom().scale(xScaleDP); 

// setup y
var yValue = function(d) { return d.AllPlayers23;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale);
 

// setup y
var yValueFP = function(d) { return d.FeaturedPlayers23;}, // data -> value
    yScaleFP = d3.scaleLinear().range([height, 0]), // value -> display
    yMapFP = function(d) { return yScaleFP(yValueFP(d));}, // data -> display
    yAxisFP = d3.axisLeft().scale(yScaleFP);  


// add the graph canvas to the body of the webpage
var svg = d3.select("#scatter").append("svg")
    .attr("width", width + margin.left  + margin.right + 30)
    .attr("height", height + margin.top  + margin.bottom + 30)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

svg.append("rect")
    .attr("dominant-baseline", "text-before-edge")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#FFF0E1");   

// add the tooltip area to the webpage
var tooltip = d3.select("#scatter").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// load data
d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/country_euro2020_qual.csv", function(error, data) {

 // change string (from CSV) into number format
  data.forEach(function(d) {
    d.AverageAge = +d.AverageAge;
    d.WeightedAverageAge = +d.WeightedAverageAge;
    d.AllPlayers23 = +d.AllPlayers23;
    d.FeaturedPlayers23 = +d.FeaturedPlayers23;
  }); 

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  //xScaleWA.domain([d3.min(data, xValueWA)-1, d3.max(data, xValueWA)+1]);
  //yScaleFP.domain([d3.min(data, yValueFP)-1, d3.max(data, yValueFP)+1]);

 // data.forEach(function(d) {console.log(d.Country, d.ColourCode)});


  // Players Title
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      //.call(xAxis)
  var titleaxis = svg.append("text")             
      .attr("transform",
            "translate(" + (width - 300) + " ," + 
                           (margin.top  + 5) + ")")
      .style("text-anchor", "middle")
      .style("font", "18px sans-serif")
      .text("All Nations");

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      //.attr("stroke-width": 1)
      //.style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px'});
      //.call(xAxis)
  var xaxis = svg.append("text")             
      .attr("transform",
            "translate(" + (width - 300) + " ," + 
                           (height + margin.top + 30) + ")")
      .style("text-anchor", "middle")
      .text("Average Age");

  svg.append("line")
     .attr("class", "ysline")
     .attr("x1", margin.left)
     .attr("y1", margin.bottom)
     .attr("x2", margin.left)
     .attr("y2", height)
     .attr("stroke-width", 2)
     .attr("stroke", "black");  

    svg.append("line")
     .attr("class", "xsline")
     .attr("x1", margin.left)
     .attr("y1", height)
     .attr("x2", width - margin.left)//  - margin.right)
     .attr("y2", height)
     .attr("stroke-width", 2)
     .attr("stroke", "black");     

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(56, 0 )")
      //.call(yAxis)
  var ylabeltext = svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50 - margin.left)
      .attr("x", 60 - (height/1.5))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Named Players Under 23 Years Old");   

  // draw dots
  
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      //.style("fill", function(d) { return color(cValue(d));})
      //.attr("fill", d.ColourCode )
      .attr("fill", function(d) {return d.ColourCode} )
      .attr("lineWidth", 3) 
      .on("mouseover", function(d) {
          d3.select(this).style("fill", function() {
                    return d3.rgb(d3.select(this).style("fill")).darker(0.99);
                    });
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.Country + " selected " + d.AllPlayers23 + " players under the age of 23 in qualification. Average squad age of " + d.AverageAge.toFixed(1) + " years old.")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - scrollY) + "px");
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
        
    if (last.id === "D1") {


              xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
              yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
                        
              svg.selectAll(".dot")
                .transition()
                .duration(1000)
                  .attr("r", 6)
                  .attr("cx", xMap)
                  .attr("cy", yMap)
              svg.selectAll(".dot")
                .on("mouseover", function(d) {
                      d3.select(this).style("fill", function() {
                                return d3.rgb(d3.select(this).style("fill")).darker(0.99);
                                });
                      tooltip.transition()
                           .duration(200)
                           .style("opacity", .9);
                      tooltip.html(d.Country + " selected " + d.AllPlayers23 + " players under the age of 23 in qualification. Average squad age of " + d.AverageAge.toFixed(1) + " years old.")
                           .style("left", (d3.event.pageX + 5) + "px")
                           .style("top", (d3.event.pageY - scrollY) + "px");
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

        if (last.id === "D2") {  
            
            svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("r", function(d) {if (d.Country == "Wales") {return 12;}
                                        else {return 4;} }  );
        }  

        if (last.id === "D3") {  

            xScaleWA.domain([d3.min(data, xValueWA)-1, d3.max(data, xValueWA)+1]);
            yScaleFP.domain([d3.min(data, yValueFP)-1, d3.max(data, yValueFP)+1]);
                        
              svg.selectAll(".dot")
                .transition()
                .duration(1000)
                  .attr("r", 6)
                  .attr("cx", xMapWA)
                  .attr("cy", yMapFP)
              svg.selectAll(".dot")
                .on("mouseover", function(d) {
                      d3.select(this).style("fill", function() {
                                return d3.rgb(d3.select(this).style("fill")).darker(0.99);
                                });
                      tooltip.transition()
                           .duration(200)
                           .style("opacity", .9);
                      tooltip.html(d.Country + " used " + d.FeaturedPlayers23 + " players under the age of 23. Average squad age of " + d.WeightedAverageAge.toFixed(1) + " years old.")
                           .style("left", (d3.event.pageX + 5) + "px")
                           .style("top", (d3.event.pageY - scrollY) + "px");
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
        
        if (last.id === "D4") {  

          titleaxis.transition()
             .style("opacity", 0)
             .transition()
             .text("From Already Qualified Nations")
             .style("opacity", 1);

          var Qualified = {'0': 0, '1': 6, '2': 0} 
            
            svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("r", function(d) {return Qualified[d.Qualified]} )
        } 

        if (last.id === "D5") {  

          titleaxis.transition()
             .style("opacity", 0)
             .transition()
             .text("Countries In Group A")
             .style("opacity", 1);
            
            svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("r", function(d) {if (d.Country == "Wales") {return 9;}
                                        else if (d.Country == "Switzerland") {return 9;}
                                        else if (d.Country == "Italy") {return 9;}
                                        else if (d.Country == "Turkey") {return 9;}
                                        else {return 0;} }  );
        }

        if (last.id === "D6") {  

          titleaxis.transition()
             .style("opacity", 0)
             .transition()
             .text("From Already Qualified Nations & Potentially Qualified")
             .style("opacity", 1);

          var Qualified = {'0': 0, '1': 6, '2': 6} 
            
            svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("r", function(d) {return Qualified[d.Qualified]} )
        }        
                     
    });
});


})()       