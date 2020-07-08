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

 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                  X AXIS VALUES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// setup x 
var xValue = function(d) { return d.gameswonperc;}, // data -> value
    xScale = d3.scaleLinear().range([50, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);

// setup x 
var xValueHome = function(d) { return d.homegameswonperc;}, // data -> value
    xScaleHome = d3.scaleLinear().range([50, width]), // value -> display
    xMapHome = function(d) { return xScaleHome(xValueHome(d));}, // data -> display
    xAxisHome = d3.axisBottom().scale(xScaleHome);

// setup x 
var xValueAway = function(d) { return d.awaygameswonperc;}, // data -> value
    xScaleAway = d3.scaleLinear().range([50, width]), // value -> display
    xMapAway = function(d) { return xScaleAway(xValueAway(d));}, // data -> display
    xAxisAway = d3.axisBottom().scale(xScaleAway);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                  Y AXIS VALUES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

// setup y
var yValue = function(d) { return d.derbygameswonperc;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale);
 
// setup y
var yValueHome = function(d) { return d.homederbygameswonperc;}, // data -> value
    yScaleHome = d3.scaleLinear().range([height, 0]), // value -> display
    yMapHome = function(d) { return yScaleHome(yValueHome(d));}, // data -> display
    yAxisHome = d3.axisLeft().scale(yScaleHome); 

// setup y
var yValueAway = function(d) { return d.awayderbygameswonperc;}, // data -> value
    yScaleAway = d3.scaleLinear().range([height, 0]), // value -> display
    yMapAway = function(d) { return yScaleAway(yValueAway(d));}, // data -> display
    yAxisAway = d3.axisLeft().scale(yScaleAway);            

//set games played circle radius
var rValue = function(d) { return d.derbygamesplayed;};
  rScale = d3.scaleLog().range([4, 12]),
  rMap = function(d) { return rScale(rValue(d));}

// add the graph canvas to the body of the webpage
var svg = d3.select("#container_scatter_best_derby_team").append("svg")
    .attr("width", width + margin.left  + margin.right + 30)
    .attr("height", height + margin.top  + margin.bottom + 30)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

svg.append("rect")
    .attr("dominant-baseline", "text-before-edge")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#FFF0E1");   



// load data
d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/BestDerbyTeam.csv", function(error, data) {

 // change string (from CSV) into number format
  data.forEach(function(d) {
    d.gameswonperc = +d.gameswonperc;
    d.homegameswonperc = +d.homegameswonperc;
    d.awaygameswonperc = +d.awaygameswonperc;
    d.derbygameswonperc = +d.derbygameswonperc;
    d.homederbygameswonperc = +d.homederbygameswonperc;
    d.awayderbygameswonperc = +d.awayderbygameswonperc;
    d.derbygamesplayed = +d.derbygamesplayed;
  }); 

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
  yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);


  // Players Title
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      //.call(xAxis)
  var titleaxis = svg.append("text")             
      .attr("transform",
            "translate(" + (width - 300) + " ," + 
                           (margin.top  + 30) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("fill", "#08415C")
      .text("Home & Away Games");

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      //.call(xAxis)
  var xaxis = svg.append("text")             
      .attr("transform",
            "translate(" + (width - 300) + " ," + 
                           (height + margin.top + 30) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("fill", "#08415C")
      .text("Overall Win Percentage");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      //.call(yAxis)
  var ylabeltext = svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50 - margin.left)
      .attr("x", 60 - (height/1.5))
      .attr("dy", "1em")
      .attr("font-size", "20px")
      .style("text-anchor", "middle")
      .attr("fill", "#08415C")
      .text("Derby Win Percentage");   

    var ColourMap = {'Man City': '#65a5d3', 'Tottenham': '#10204b', 'Liverpool': '#d3151e', 'Chelsea': '#094595', 
                     'Arsenal': '#ff0200',  'Aston Villa': '#490024', 'Bournemouth': '#bf1014', 'Brighton': '#1000fd', 
                     'Cardiff': '#1a5e9c', 'Crystal Palace': '#444678',  'Everton': '#003299', 'Fulham': '#090808',  
                     'Man United': '#d20222',  'Middlesbrough':'#dc1b21', 'Newcastle': '#000000', 'QPR': '#0053a3', 
                     'Southampton': '#d61a1f', 'Sunderland': '#e7212b', 'Swansea': '#000000', 'West Brom' : '#002868', 'West Ham': '#7c2c3a'}
  
  // create tooltip for mouseover
  var tooltip = d3.select("#container_scatter_best_derby_team")
      .append("div")
      .style("position", "absolute")
      .attr("class", "tooltip")
      .style("text-align", "right")
      .style("width", "140px")
      .style("height", "80px")
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
      .html(d.Team + " played " + d.derbygamesplayed + " derby games in the last 6 seasons, and have a win percentage of " + 
                       Math.round(d.gameswonperc*10000)/100 + "% in all games compared to " + 
                       Math.round(d.derbygameswonperc*10000)/100 + "% in derby games.")
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

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", rMap)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("fill", function(d) {return ColourMap[d.Team]} )
      .attr("lineWidth", 0) 
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      /*
      .on("mouseover", function(d) {
          d3.select(this).style("fill", function() {
                    return d3.rgb(d3.select(this).style("fill")).darker(0.99);
                    });
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.Team + " played " + d.derbygamesplayed + " derby games in the last 6 seasons, and have a win percentage of " + 
                       Math.round(d.gameswonperc*100000)/100 + "% in all games compared to " + 
                       Math.round(d.derbygameswonperc*100000)/100 + "% in derby games.")
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
      */

var placeholders = document.querySelectorAll(".placeholderText_Scatter_best_derby_team > p")
    
    
window.addEventListener("scroll", function(e) {
    
    
    var last;
    for (var placeholder of placeholders) { 
        var top = placeholder.getBoundingClientRect().top
        if (top < 0 )
            {
            last = placeholder  
            }
        }

    if (last.id === "P14") {

      xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
      yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

      svg.selectAll(".dot")
          .transition()
            .attr("cx", xMap)
            .attr("cy", yMap)

      titleaxis.transition()
             .style("opacity", 0)
             .transition()
             .text("Home & Away Games")
             .style("opacity", 1); 




      var mousemove = function(d) {
            tooltip
              .html(d.Team + " played " + d.derbygamesplayed + " derby games in the last 6 seasons, and have a win percentage of " + 
                               Math.round(d.gameswonperc*10000)/100 + "% in all games compared to " + 
                               Math.round(d.derbygameswonperc*10000)/100 + "% in derby games.")
              .style("left", (d3.event.pageX + 30) + "px")
              .style("top", (d3.event.pageY - scrollY + 30) + "px");
          }


        }

        if (last.id === "P15") {  

      xScaleHome.domain([d3.min(data, xValueHome), d3.max(data, xValueHome)]);
      yScaleHome.domain([d3.min(data, yValueHome), d3.max(data, yValueHome)]);

      svg.selectAll(".dot")
          .transition()
            .attr("cx", xMapHome)
            .attr("cy", yMapHome)  

      titleaxis.transition()
             .style("opacity", 0)
             .transition()
             .text("Home Games")
             .style("opacity", 1);                 

      var mousemove = function(d) {
          tooltip
          .html(d.Team + " played " + d.homederbygamesplayed + " home derby games in the last 6 seasons, and have a win percentage of " + 
                       Math.round(d.homegameswonperc*10000)/100 + "% in all games compared to " + 
                       Math.round(d.homederbygameswonperc*10000)/100 + "% in derby games.")
          .style("left", (d3.event.pageX + 30) + "px")
          .style("top", (d3.event.pageY - scrollY + 30) + "px");                         
            }
        }

        if (last.id === "P16") {  

      xScaleAway.domain([d3.min(data, xValueAway), d3.max(data, xValueAway)]);
      yScaleAway.domain([d3.min(data, yValueAway), d3.max(data, yValueAway)]);

      svg.selectAll(".dot")
          .transition()
            .attr("cx", xMapAway)
            .attr("cy", yMapAway)

      titleaxis.transition()
             .style("opacity", 0)
             .transition()
             .text("Away Games")
             .style("opacity", 1);              

      var mousemove = function(d) {
            tooltip
              .html(d.Team + " played " + d.awayderbygamesplayed + " away derby games in the last 6 seasons, and have a win percentage of " + 
                               Math.round(d.awaygameswonperc*10000)/100 + "% in all games compared to " + 
                               Math.round(d.awayderbygameswonperc*10000)/100 + "% in derby games.")
              .style("left", (d3.event.pageX + 30) + "px")
              .style("top", (d3.event.pageY - scrollY + 30) + "px");
          }                                     

        } 
                   

    });
});


})()       