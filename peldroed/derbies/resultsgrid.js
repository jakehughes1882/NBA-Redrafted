(function () {
// set the dimensions and margins of the graph
var margin_grid = {top: 120, right: 25, bottom: 120, left: 95},
  width = 900 - margin_grid.left - margin_grid.right,
  height = 700 - margin_grid.top - margin_grid.bottom;

// append the svg object to the body of the page
var svg = d3.select("#container_grid_bar")
.append("svg")
  .attr("width", width + margin_grid.left + margin_grid.right)
  .attr("height", height + margin_grid.top + margin_grid.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin_grid.left + "," + margin_grid.top + ")");

//Read the data
//d3.csv('/Users/jakehughes/Documents/PythonScripts/NBA/NBADraftPicks_test.csv', function(data) {
d3.csv('https://raw.githubusercontent.com/jakehughes1882/data/master/PremierLeagueResultsGrid201819.csv', function(data) {

  data.sort(function(x, y){
      const order = d3.ascending( x.HomeTeam, y.HomeTeam) || d3.descending( x.AwayTeam, y.AwayTeam) ;
      //console.log(order);
      return order;
    })

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = d3.map(data, function(d){return d.HomeTeam;}).keys()
  var myVars = d3.map(data, function(d){return d.AwayTeam;}).keys()

  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.02);
  //bottom x labels  
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("transform", "rotate(-65)")
    .attr("dx", "-4em")
    .attr("fill", "#08415C")
    .select(".domain").remove()
  //top x labels  
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + 0 + ")")
    .call(d3.axisTop(x).tickSize(0))
    .selectAll("text")
    .attr("transform", "rotate(-65)")
    .attr("dx", "4em")
    .attr("fill", "#08415C")
    .select(".domain").remove()

  // Build Y scales and axis:
  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.02);
  //left y labels  
  svg.append("g")
    .style("font-size", 14)
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll("text")
    .attr("fill", "#08415C")

  svg.selectAll("g")  
    .select(".domain").remove()

  // Assign colours to outcomes
  var ColourMap = {'1': '#A3BE8C', '0': '#EBCB8B', '-1': '#BF616A'}    
  // create tooltip for mouseover
  var tooltip = d3.select("#container_grid_bar")
      .append("div")
      .style("position", "absolute")
      .attr("class", "tooltip")
      .style("text-align", "right")
      .style("width", "140px")
      .style("height", "40px")
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
      .html(d.HomeTeam + "  " + d.Result + " against " + d.AwayTeam + " " + d.Scoreline + " on " + d.Date + ".")
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
  

  // add the squares
  var cells = svg.selectAll(".squares")
    .data(data, function(d) {return d.HomeTeam+':'+d.AwayTeam;})
  .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.HomeTeam) })
      .attr("y", function(d) { return y(d.AwayTeam) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .attr("fill", function(d) {return ColourMap[d.Outcome]})
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    

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
  

    cells.transition()
        .attr("fill", function(d) {return ColourMap[d.Outcome]})

      }    
    
    if (last.id === "P2") { 

    var ColourMapRivals = {'0': '#A3BE8C', '1': '#EBCB8B', '2': '#D08770', '3':"#BF616A"}    

    cells.transition()
        .attr("fill", function(d) {return ColourMapRivals[d.DerbyFlag]})
        .style("stroke", "none");

      }

  if (last.id === "P3") { 

    var LineMapRivals = {'0': "none", '1': "#08415C", '2': "#08415C", '3':"#08415C"}  
    cells.transition()
        .attr("fill", function(d) {return ColourMap[d.Outcome]})
        .style("stroke", function(d) {return LineMapRivals[d.DerbyFlag]});
      }

  if (last.id === "P4") { 

    var ColourMapDerbyResults = {'0 won': '#FFF0E1', '0 drew': '#FFF0E1', '0 lost': '#FFF0E1',
                                 '1 won': '#A3BE8C', '1 drew': '#EBCB8B', '1 lost': '#BF616A',
                                 '2 won': '#A3BE8C', '2 drew': '#EBCB8B', '2 lost': '#BF616A',
                                 '3 won': '#A3BE8C', '3 drew': '#EBCB8B', '3 lost': '#BF616A'
                                  }  
    cells.transition()
         .attr("fill", function(d) {return ColourMapDerbyResults[(d.DerbyFlag) + ' ' + d.Result]});

      }    
      });

  });

})()     




