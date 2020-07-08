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
var xValue = function(d) { return d.EPLPosition;}, // data -> value
    xScale = d3.scaleLinear().range([50, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);

var xValueALT = function(d) { return d.EPLPosition_Difference;}, // data -> value
    xScaleALT = d3.scaleLinear().range([50, width]), // value -> display
    xMapALT = function(d) { return xScaleALT(xValueALT(d));}, // data -> display
    xAxisALT = d3.axisBottom().scale(xScaleALT);

// setup y
var yValue = function(d) { return d.ClubSquadRetained;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale); 

// New Players
var yValueNew = function(d) { return d.ClubSquadNew;}, // data -> value
    yScaleNew = d3.scaleLinear().range([height, 0]), // value -> display
    yMapNew = function(d) { return yScaleNew(yValueNew(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScaleNew);

// New Players
var yValueNewP = function(d) { return (d.ClubSquadNew/d.ClubSquadSize);}, // data -> value
    yScaleNewP = d3.scaleLinear().range([height, 0]), // value -> display
    yMapNewP = function(d) { return yScaleNewP(yValueNewP(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScaleNewP);

// Club Retained %
var yValueALT = function(d) { return (d.ClubSquadRetained/d.ClubSquadSize);}, // data -> value
    yScaleALT = d3.scaleLinear().range([height, 0]), // value -> display
    yMapALT = function(d) { return yScaleALT(yValueALT(d));}, // data -> display
    yAxisALT = d3.axisLeft().scale(yScaleALT); 

// Minutes Retained
var yValueMR = function(d) { return (d.SquadMinutesRetained);}, // data -> value
    yScaleMR = d3.scaleLinear().range([height, 0]), // value -> display
    yMapMR = function(d) { return yScaleMR(yValueMR(d));}, // data -> display
    yAxisMR = d3.axisLeft().scale(yScaleMR); 

// Minutes Retained %
var yValueMRP = function(d) { return (d.SquadMinutesRetained/d.SquadMinutes);}, // data -> value
    yScaleMRP = d3.scaleLinear().range([height, 0]), // value -> display
    yMapMRP = function(d) { return yScaleMRP(yValueMRP(d));}, // data -> display
    yAxisMRP = d3.axisLeft().scale(yScaleMRP); 

// Minutes By New Players
var yValueMN = function(d) { return (d.SquadMinutesNew);}, // data -> value
    yScaleMN = d3.scaleLinear().range([height, 0]), // value -> display
    yMapMN = function(d) { return yScaleMN(yValueMN(d));}, // data -> display
    yAxisMN = d3.axisLeft().scale(yScaleMN); 

// Minutes By New Players %
var yValueMNP = function(d) { return (d.SquadMinutesNew/d.SquadMinutes);}, // data -> value
    yScaleMNP = d3.scaleLinear().range([height, 0]), // value -> display
    yMapMNP = function(d) { return yScaleMNP(yValueMNP(d)) + 15 ;}, // data -> display
    yAxisMNP = d3.axisLeft().scale(yScaleMNP);                     

// setup fill color
var cValue = function(d) { return d.Club;},
    color = d3.scaleOrdinal(d3.schemeCategory20b);

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
    .attr("fill", "#D8DEE9");   

// add the tooltip area to the webpage
var tooltip = d3.select("#scatter").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// load data
d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/Team_squad_and_results.csv", function(error, data) {

 // change string (from CSV) into number format
  data.forEach(function(d) {
    d.EPLPosition = +d.EPLPosition;
    d.ClubSquadRetained = +d.ClubSquadRetained;
    d.EPLPosition_Difference = +d.EPLPosition_Difference;
    d.ClubSquadSize = +d.ClubSquadSize;
    d.ClubSquadNew = +d.ClubSquadNew;
    d.SquadMinutes = +d.SquadMinutes;
    d.SquadMinutesRetained = +d.SquadMinutesRetained;
    d.SquadMinutesNew = +d.SquadMinutesNew;
//    console.log(d);
  }); 

  //data.filter(function(d){ return d.Season != "2015/16" })
  //data.filter(function(d){ return d.ClubSquadRetained < 2 })
  data = data.filter(function(d) {
    return d.ClubSquadRetained > 1;
  })

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      //.call(xAxis)
  svg.append("text")             
      .attr("transform",
            "translate(" + (width - 300) + " ," + 
                           (height + margin.top + 30) + ")")
      .style("text-anchor", "middle")
      .text("EPL Position");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      //.call(yAxis)
  var ylabeltext = svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50 - margin.left)
      .attr("x", 60 - (height/1.5))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Squad Retention");   

    var ColourMap = {'Watford': '#fbf00a', 'Everton': '#003299', 'Newcastle United': '#000000', 'Southampton': '#d61a1f', 'Norwich': '#038842',
                     'Manchester City': '#65a5d3', 'Tottenham': '#10204b', 'Liverpool': '#d3151e', 'Chelsea': '#094595', 'West Ham': '#7c2c3a',
                     'Arsenal': '#ff0200', 'Brighton': '#1000fd', 'Crystal Palace': '#444678', 'Leicester': '#283d8a', 'Manchester United': '#d20222',
                     'Burnley': '#70193d', 'Wolverhampton Wanderers': '#fc891c', 'Sheffield United': '#f02329', 'Aston Villa': '#490024', 'Bournemouth': '#bf1014',
                     'Stoke': '#d7172f', 'Swansea': '#efefef', 'Sunderland': '#db001b', 'Huddersfield': '#3799d7', 
                     'West Bromwich Albion': '#002868'
            } 
  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      //.style("fill", function(d) { return color(cValue(d));})
      .attr("fill", function(d) {return ColourMap[d.Club]} )
      .attr("lineWidth", 0) 
      .on("mouseover", function(d) {
          d3.select(this).style("fill", function() {
                    return d3.rgb(d3.select(this).style("fill")).darker(0.99);
                    });
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("During the " + d.Season + " season, " + d.Club + " finished in the " + d.EPLPosition 
                     + " position, and that season retained " +  d.ClubSquadRetained
                     + " of their squad from the season prior.")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - scrollY - 28) + "px");
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


    if (last.id === "P1") {
            
            xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
            yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
            
            svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("r", 5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                //.style("fill", function(d) { return color(cValue(d));})
                .attr("fill", function(d) {return ColourMap[d.Club]} )
                .attr("lineWidth", 0) 
            svg.selectAll(".dot")     
                .on("mouseover", function(d) {
                    d3.select(this).style("fill", function() {
                              return d3.rgb(d3.select(this).style("fill")).darker(0.99);
                              });
                    tooltip.transition()
                         .duration(200)
                         .style("opacity", .9)
                         .style("height", "80px");
                    tooltip.html("During the " + d.Season + " season, " + d.Club + " finished in the " + d.EPLPosition 
                               + " position, and that season retained " +  d.ClubSquadRetained
                               + " of their squad from the season prior.")
                         .style("left", (d3.event.pageX + 5) + "px")
                         .style("top", (d3.event.pageY - scrollY - 28) + "px");
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

        if (last.id === "P2") { 


            xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
            yScaleMNP.domain([d3.min(data, yValueMNP), d3.max(data, yValueMNP)]);

            /*
            ylabeltext.exit().remove();
              svg.append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 50 - margin.left)
                  .attr("x", 60 - (height/1.5))
                  .attr("dy", "1em")
                  .style("text-anchor", "middle")
                  .text("Minutes By New Players");
            */      
            
            svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("r", 5)
                .attr("cx", xMap)
                .attr("cy", yMapMNP)
                //.style("fill", function(d) { return color(cValue(d));})
                .attr("fill", function(d) {return ColourMap[d.Club]} )
                .attr("lineWidth", 0) 
            svg.selectAll(".dot")     
                .on("mouseover", function(d) {
                    d3.select(this).style("fill", function() {
                              return d3.rgb(d3.select(this).style("fill")).darker(0.99);
                              });
                    tooltip.transition()
                         .duration(200)
                         .style("opacity", .9)
                         .style("height", "108px");
                    tooltip.html("During the " + d.Season + " season, " + d.Club + " finished in the " + d.EPLPosition 
                               + " position, and that season, " +  d3.format(".0%")(d.SquadMinutesNew/d.SquadMinutes) 
                               + " of minutes were played by signings or youth team graduates.")
                         .style("left", (d3.event.pageX + 5) + "px")
                         .style("top", (d3.event.pageY - scrollY - 28)  + "px");
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

        if (last.id === "P3") { 

            
            xScaleALT.domain([d3.min(data, xValueALT)-1, d3.max(data, xValueALT)+1]);
            yScaleMNP.domain([d3.min(data, yValueMNP), d3.max(data, yValueMNP)]);

            svg.select(".x.axis")
                .transition()
                .duration(1000)
                //.call(xAxisALT);

            svg.selectAll(".dot")
                .transition()
                .duration(200)
                .attr("cx", 320)
                .transition()
                .duration(1000)
                .attr("r", 5)
                .attr("cx", xMapALT)
                .attr("cy", yMapMNP)
                //.style("fill", function(d) { return color(cValue(d));})
                .attr("fill", function(d) {return ColourMap[d.Club]} )
                .attr("lineWidth", 0) 
            svg.selectAll(".dot")      
                .on("mouseover", function(d) {
                    d3.select(this).style("fill", function() {
                              return d3.rgb(d3.select(this).style("fill")).darker(0.99);
                              });
                    tooltip.transition()
                         .duration(200)
                         .style("opacity", .9)
                         .style("height", "108px");
                    tooltip.html("During the " + d.Season + " season, " + d.Club + " finished with a position difference of " + d.EPLPosition_Difference 
                               + " than the previous season, and that season, " +  d3.format(".0%")(d.SquadMinutesNew/d.SquadMinutes) 
                               + " of minutes were played by signings or youth team graduates.")
                         .style("left", (d3.event.pageX + 5) + "px")
                         .style("top", (d3.event.pageY - scrollY - 28)  + "px");
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

         var SizeMap = {'Watford': 5, 'Everton': 5, 'Newcastle United': 5, 'Southampton': 5, 'Norwich': 5,
                     'Manchester City': 5, 'Tottenham': 10, 'Liverpool': 5, 'Chelsea': 5, 'West Ham': 5,
                     'Arsenal': 5, 'Brighton': 5, 'Crystal Palace': 5, 'Leicester': 5, 'Manchester United': 5,
                     'Burnley': 5, 'Wolverhampton Wanderers': 5, 'Sheffield United': 5, 'Aston Villa': 5, 'Bournemouth': 5,
                     'Stoke': 5, 'Swansea': 5, 'Sunderland': 5, 'Huddersfield': 5, 'West Bromwich Albion': 5
            } 
        
        var BrightnessMap = {'Watford': 0, 'Everton': 0, 'Newcastle United': 0, 'Southampton': 0, 'Norwich': 0,
                     'Manchester City': 0, 'Tottenham': 0.99, 'Liverpool': 0, 'Chelsea': 0, 'West Ham': 0,
                     'Arsenal': 0, 'Brighton': 0, 'Crystal Palace': 0, 'Leicester': 0, 'Manchester United': 0,
                     'Burnley': 0, 'Wolverhampton Wanderers': 0, 'Sheffield United': 0, 'Aston Villa': 0, 'Bournemouth': 0,
                     'Stoke': 0, 'Swansea': 0, 'Sunderland': 0, 'Huddersfield': 0, 'West Bromwich Albion': 0
            }       

            svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("r", function(d) {return SizeMap[d.Club]} )
                .style("fill", function(d){return d3.rgb(function(d) {return ColourMap[d.Club]} ).brighter(function(d) {return BrightnessMap[d.Club]} );})
        } 

        if (last.id === "P5") { 


         var SizeMap = {'Watford': 5, 'Everton': 5, 'Newcastle United': 5, 'Southampton': 5, 'Norwich': 5,
                     'Manchester City': 10, 'Tottenham': 5, 'Liverpool': 10, 'Chelsea': 10, 'West Ham': 5,
                     'Arsenal': 10, 'Brighton': 5, 'Crystal Palace': 5, 'Leicester': 5, 'Manchester United': 10,
                     'Burnley': 5, 'Wolverhampton Wanderers': 5, 'Sheffield United': 5, 'Aston Villa': 5, 'Bournemouth': 5,
                     'Stoke': 5, 'Swansea': 5, 'Sunderland': 5, 'Huddersfield': 5, 'West Bromwich Albion': 5
            } 
        
        var BrightnessMap = {'Watford': 0, 'Everton': 0, 'Newcastle United': 0, 'Southampton': 0, 'Norwich': 0,
                     'Manchester City': 0.99, 'Tottenham': 0, 'Liverpool': 0.99, 'Chelsea': 0.99, 'West Ham': 0,
                     'Arsenal': 0.99, 'Brighton': 0, 'Crystal Palace': 0, 'Leicester': 0, 'Manchester United': 0.99,
                     'Burnley': 0, 'Wolverhampton Wanderers': 0, 'Sheffield United': 0, 'Aston Villa': 0, 'Bournemouth': 0,
                     'Stoke': 0, 'Swansea': 0, 'Sunderland': 0, 'Huddersfield': 0, 'West Bromwich Albion': 0
            }       

            svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("r", function(d) {return SizeMap[d.Club]} )
                .style("fill", function(d){return d3.rgb(function(d) {return ColourMap[d.Club]} ).brighter(function(d) {return BrightnessMap[d.Club]} );})
        } 

        if (last.id === "P6") { 


         var SizeMap = {'Watford': 5, 'Everton': 5, 'Newcastle United': 5, 'Southampton': 5, 'Norwich': 5,
                     'Manchester City': 5, 'Tottenham': 5, 'Liverpool': 10, 'Chelsea': 5, 'West Ham': 5,
                     'Arsenal': 5, 'Brighton': 5, 'Crystal Palace': 5, 'Leicester': 5, 'Manchester United': 5,
                     'Burnley': 5, 'Wolverhampton Wanderers': 5, 'Sheffield United': 5, 'Aston Villa': 5, 'Bournemouth': 5,
                     'Stoke': 5, 'Swansea': 5, 'Sunderland': 5, 'Huddersfield': 5, 'West Bromwich Albion': 5
            } 
        
        var BrightnessMap = {'Watford': 0, 'Everton': 0, 'Newcastle United': 0, 'Southampton': 0, 'Norwich': 0,
                     'Manchester City': 0.99, 'Tottenham': 0, 'Liverpool': 0.99, 'Chelsea': 0.99, 'West Ham': 0,
                     'Arsenal': 0.99, 'Brighton': 0, 'Crystal Palace': 0, 'Leicester': 0, 'Manchester United': 0.99,
                     'Burnley': 0, 'Wolverhampton Wanderers': 0, 'Sheffield United': 0, 'Aston Villa': 0, 'Bournemouth': 0,
                     'Stoke': 0, 'Swansea': 0, 'Sunderland': 0, 'Huddersfield': 0, 'West Bromwich Albion': 0
            }       

            svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("r", function(d) {return SizeMap[d.Club]} )
                .style("fill", function(d){return d3.rgb(function(d) {return ColourMap[d.Club]} ).brighter(function(d) {return BrightnessMap[d.Club]} );})
        }  
            

    });

});


})()       