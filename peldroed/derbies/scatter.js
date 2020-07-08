(function () {

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 680 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x initial position
var xValue = function(d) { return d.xInitVal;}, // data -> value
    xScale = d3.scaleLinear().range([50, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);

// setup x 
var xValueNew = function(d) { return d.xNewVal;},  // + ((((Math.random())*2)-1)*0.1) ;}, // data -> value
    xScaleNew = d3.scaleLinear().range([50, width]), // value -> display
    xMapNew = function(d) { return xScaleNew(xValueNew(d));}, // data -> display
    xAxisNew = d3.axisBottom().scale(xScaleNew);    

// setup y inital position
var yValue = function(d) { return d.yInitVal;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale);

// setup y
var yValueNew = function(d) { return d.yNewVal;}, // data -> value
    yScaleNew = d3.scaleLinear().range([height, 0]), // value -> display
    yMapNew = function(d) { return yScaleNew(yValueNew(d));}, // data -> display
    yAxisNew = d3.axisLeft().scale(yScaleNew);  
           
// add the graph canvas to the body of the webpage
var svg = d3.select("#container_scatter").append("svg")
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
var tooltip = d3.select("#container_scatter").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/PremierLeagueResults.csv", function(error, data) {

 // change string (from CSV) into number format
  data.forEach(function(d) {
    d.TotalShots = +d.TotalShots;
    d.TotalGoals = +d.TotalGoals;
    d.HomeGoals = +d.HomeGoals;
    d.AwayGoals = +d.AwayGoals;
    d.TotalFouls = +d.TotalFouls;
    d.TotalYellow = +d.TotalYellow;
    d.TotalRed = +d.TotalRed;
  });  

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

//BOTTOM KPIs
  var DrawsAll = svg.append("text")             
      .attr("transform",
            "translate(" + (width - 300) + " ," + 
                           (height  + 30) + ")")
      .style("text-anchor", "middle")

      .attr("font-size", "12px")
      .attr("fill", "#08415C")
      .style("opacity", 0) 
      .text("Draws: 500"); 

  var HomeWinAll = svg.append("text")             
      .attr("transform",
            "translate(" + (width - 20) + " ," + 
                           (height  + 30) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#08415C")
      .style("opacity", 0) 
      .text("Home Wins: 1200"); 
      

   var AwayWinAll = svg.append("text")             
      .attr("transform",
            "translate(" + (50) + " ," + 
                           (height  + 30) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#08415C")
      .style("opacity", 0) 
      .text("Away Wins: 700"); 

//TOP KPIs
  var DrawsDerby = svg.append("text")             
      .attr("transform",
            "translate(" + (width - 300) + " ," + 
                           (150) + ")")
      .style("text-anchor", "middle")

      .attr("font-size", "12px")
      .attr("fill", "#08415C")
      .style("opacity", 0) 
      .text("Derby Draws: 50"); 

  var HomeWinDerby = svg.append("text")             
      .attr("transform",
            "translate(" + (width - 20) + " ," + 
                           (150) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#08415C")
      .style("opacity", 0) 
      .text("Derby Home Wins: 100"); 
      

   var AwayWinDerby = svg.append("text")             
      .attr("transform",
            "translate(" + (50) + " ," + 
                           (150) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#08415C")
      .style("opacity", 0) 
      .text("Derby Away Wins: 50");       


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
      .text(" ");

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      //.call(xAxis)

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      //.call(yAxis)  
  
  var ColourMap = {'Watford': '#fbf00a', 'Everton': '#003299', 'Newcastle United': '#000000', 'Southampton': '#d61a1f', 'Norwich': '#038842',
                     'Manchester City': '#65a5d3', 'Tottenham': '#10204b', 'Liverpool': '#d3151e', 'Chelsea': '#094595', 'West Ham': '#7c2c3a',
                     'Arsenal': '#ff0200', 'Brighton': '#1000fd', 'Crystal Palace': '#444678', 'Leicester': '#283d8a', 'Manchester United': '#d20222',
                     'Burnley': '#70193d', 'Wolverhampton Wanderers': '#fc891c', 'Sheffield United': '#f02329', 'Aston Villa': '#490024', 'Bournemouth': '#bf1014',
                     'Stoke': '#d7172f', 'Swansea': '#efefef', 'Sunderland': '#db001b', 'Huddersfield': '#3799d7', 
                     'West Bromwich Albion': '#002868'
            }
   
  //var grad = svg.append("defs").append("linearGradient").attr("id", "grad")
  //  .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
  //grad.append("stop").attr("offset", "50%").style("stop-color", (function(d) {return ColourMap[d.HomeTeam]}));
  //grad.append("stop").attr("offset", "50%").style("stop-color", data.map(function(d) {return ColourMap[d.AwayTeam]}));

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("opacity", 0.5)
      .attr("fill", '#08415C')
      //.attr("fill", "url(#grad)")
      //.attr("fill", function(d) {return ColourMap[d.Club]} )
      .attr("lineWidth", 0) 
      .on("mouseover", function(d) {
          d3.select(this).style("fill", function() {
                    return d3.rgb(d3.select(this).style("fill")).darker(0.99);
                    });
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.HomeTeam + "  " + d.Result + " against " + d.AwayTeam + " " + d.Scoreline + " on " + d.Date + ".")
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



var placeholders = document.querySelectorAll(".placeholderText_scatter > p")
    
    
window.addEventListener("scroll", function(e) {
    
    
    var last;
    for (var placeholder of placeholders) { 
        var top = placeholder.getBoundingClientRect().top
        if (top < 0 )
            {
            last = placeholder  
            }
        }

        if (last.id === "P5") {

          xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
          yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

          svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("cx", xMap)
                .attr("cy", yMap)

        DrawsAll.transition()
                .style("opacity", 0)
                .transition()
                .text("Games: 2400")  
                .transition()
                .style("opacity", 1)
        HomeWinAll.transition()
                .style("opacity", 0)  
        AwayWinAll.transition()
                .style("opacity", 0)                        

        }

        if (last.id === "P6") {  

          xScaleNew.domain([d3.min(data, xValueNew)-1, d3.max(data, xValueNew)+1]);
          yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

          svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("cx", xMapNew)
                .attr("cy", yMap) 

        DrawsAll.transition()
                .attr("transform",
            "translate(" + (width - 300) + " ," + 
                           (height  + 30) + ")")
                .style("opacity", 0)
                .transition()
                .text("Draws: 500")  
                .transition()
                .style("opacity", 1)  
        HomeWinAll.transition()
                .attr("transform",
            "translate(" + (width - 30) + " ," + 
                           (height  + 30) + ")")
                .transition()
                .style("opacity", 1)  
        AwayWinAll.transition()
                .attr("transform",
            "translate(" + (50) + " ," + 
                           (height  + 30) + ")")
                .transition()
                .style("opacity", 1)  

        DrawsDerby.transition()
                .style("opacity", 0)  
        HomeWinDerby.transition()
                .style("opacity", 0)  
        AwayWinDerby.transition()
                .style("opacity", 0)         

        }

        if (last.id === "P7") {

          xScaleNew.domain([d3.min(data, xValueNew)-1, d3.max(data, xValueNew)+1]);
          yScaleNew.domain([d3.min(data, yValue), d3.max(data, yValue)]);
          //yScaleNew.domain([d3.min(data, yValueNew)+2, d3.max(data, yValueNew)+1]);
          svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("cx", xMapNew)
                .attr("cy", yMapNew) 

        DrawsAll.transition()
                .style("opacity", 0)
                .transition()
                .attr("transform",
                          "translate(" + (width - 300) + " ," + 
                           (height  - 70) + ")")
                .text("Non-Derby Draws: 450")  
                .transition()
                .style("opacity", 1)  
        HomeWinAll.transition()
                .attr("transform",
                          "translate(" + (width - 30) + " ," + 
                           (height  - 70) + ")")
                .text("Non-Derby Home Wins: 1100")
                .transition()
                .style("opacity", 1)  
        AwayWinAll.transition()
                .attr("transform",
                          "translate(" + (50) + " ," + 
                           (height  - 70) + ")")
                .text("Non-Derby Away Wins: 630")
                .transition()
                .style("opacity", 1)

        DrawsDerby.transition()
                .style("opacity", 1)  
        HomeWinDerby.transition()
                .style("opacity", 1)  
        AwayWinDerby.transition()
                .style("opacity", 1)        



        } 

        if (last.id === "P8") {                

        }
                  

    });
});


})()       