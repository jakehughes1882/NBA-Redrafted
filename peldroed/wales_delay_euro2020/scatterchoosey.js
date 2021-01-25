(function () {

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.PlayerAge;}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);

// setup y
var yValue = function(d) { return d.Minutes;}, // data -> value
    yScale = d3.scaleLinear().range([height, 25]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale); 
                   

// add the graph canvas to the body of the webpage
var svg = d3.select("#scatter_player").append("svg")
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
var tooltip = d3.select("#scatter_player").append("div")
    .attr("class", "tooltip_scatter")
    .style("opacity", 0);


// load data
d3.csv("https://raw.githubusercontent.com/jakehughes1882/data/master/player_euro2020_qual.csv", function(error, data) {

  data.sort(function(x, y){
    return d3.ascending(x.Country, y.Country);
  })

 // List of groups (here I have one group per column)
  var allGroup = d3.map(data, function(d){return(d.Country)}).keys()

  
  //add All Countries option
  allGroup.unshift("All Countries")

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button 
    .enter()
    .append('option') 
    .text("All")
    .attr("value", "All")

 // change string (from CSV) into number format
  data.forEach(function(d) {
    d.PlayerAge = +d.PlayerAge;
    d.Minutes = +d.Minutes;
//    console.log(d);
  }); 


  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
  yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

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
      .style("text-fill", "#2E3440")
      .text("Age (as of 22nd of May 2020)");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      //.call(yAxis)
  var ylabeltext = svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", 60 - (height/1.5))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#2E3440")
      .text("Minutes Played"); 

    svg.append("line")
     .attr("class", "ysline")
     .attr("x1", -13)
     .attr("y1", margin.bottom)
     .attr("x2", -13)
     .attr("y2", (height + margin.top))
     .attr("stroke-width", 2)
     .attr("stroke", "black");  

    svg.append("line")
     .attr("class", "xsline")
     .attr("x1", -13)
     .attr("y1", (height + margin.top))
     .attr("x2", width + margin.left)//  - margin.right)
     .attr("y2", (height + margin.top))
     .attr("stroke-width", 2)
     .attr("stroke", "black");  

    var ColourMap = {'England': '#ec2d2a','Czech Republic': '#f62933','Kosovo': '#4058b1','Bulgaria': '#166f4a','Montengro': '#e71924','Ukraine': '#e3d42a',
                     'Portugal': '#d61029','Serbia': '#d2314c','Luxembourg': '#cb2134','Lithuania': '#d5b81a','Germany': '#deeff5','Netherlands': '#ec6a20',
                     'Northern Ireland': '#2eaf7c','Belarus': '#e00618','Estonia': '#4183c6','Switzerland': '#f33b41','Denmark': '#da283e','Republic of Ireland': '#106c45',
                     'Georgia': '#f52527','Gibraltar': '#9c030b','Croatia': '#c70c0b','Wales': '#f8373b','Slovakia': '#154baa','Hungary': '#c41c19','Azerbaijan': '#3863de',
                     'Spain': '#dc2922','Sweden': '#f5dd3e','Norway': '#b30c25','Romania': '#f3f32b','Faroe Islands': '#3f6bdb','Malta': '#bf0512',
                     'Poland': '#dbdfe5','Austria': '#d21f06','North Macedonia': '#e23529','Slovenia': '#7cbf1a','Israel': '#0a1b6a','Latvia': '#590e14',
                     'France': '#557dec','Turkey': '#d32730','Iceland': '#1374da','Albania': '#a2141e','Andorra': '#dfd846','Moldova': '#1e389c',
                     'Belgium': '#ea6734','Russia': '#ec3023','Scotland': '#252b4b','Cyprus': '#6ea8ea','Kazakhstan': '#ece42d','San Marino': '#5786e0',
                     'Italy': '#0261a5','Finland': '#f8f8f8','Greece': '#4d66e1','Bosnia and Herzegovina': '#2439d3','Armenia': '#ef7e1e','Liechtenstein': '#072280'}
 
  // draw dots
  var dot = svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      //.style("fill", function(d) { return color(cValue(d));})
      .attr("fill", function(d) {return ColourMap[d.Country]} )
      .attr("lineWidth", 0) 
      .on("mouseover", function(d) {
          d3.select(this).style("fill", function() {
                    return d3.rgb(d3.select(this).style("fill")).darker(0.99);
                    });
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.PlayerName + " (" + d.PlayerAge + ") played " + d.Minutes + " minutes for " + d.Country + " during the qualification round.")
               .style("left", (d3.event.pageX + 13) + "px")
               .style("top", (d3.event.pageY + 13) + "px");
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill", function() {
            return d3.rgb(d3.select(this).style("fill")).brighter(0.99);
            });
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

    // A function that update the chart
    function update(selectedGroup) {

      var selectedteam = selectedGroup

    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {

        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        console.log(selectedOption)

        svg.selectAll(".dot")
                .transition()
                .duration(1000)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .attr("r", function(d) {if (selectedOption == "All Countries") {return 6;}
                                        else if (d.Country == selectedOption)  {return 6;} else {return 0;} }  );
    })

});


})()       