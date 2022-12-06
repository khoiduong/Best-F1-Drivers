//
//var margin = {top: 10, right: 40, bottom: 50, left: 50},
//    width = 760 - margin.left - margin.right,
//    height = 500 - margin.top - margin.bottom;
//
//
//
//var svg = d3.select("body").append("svg")
//    .attr("width", width + margin.left + margin.right)
//    .attr("height", height + margin.top + margin.bottom)
//    .append("g")
//    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var margin = { top: 10, right: 90, bottom: 150, left: 0 },
  chart_width = 500 - margin.left - margin.right,
  chart_height = 500 - margin.top - margin.bottom;

var svg = d3
  .select(".svg2")
  .append("svg")
  //.attr("width", width + margin.left + margin.right)
  .attr("width", "580")
  .attr("height", chart_height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + 5 + margin.left + "," + margin.top + ")");

var xScale = d3.scaleLinear().range([0, chart_width]);
var yScale = d3.scaleLinear().range([chart_height, 0]);
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
var yAxis = d3.axisLeft(yScale);

// hard coded driver id's
var driverList = [
  //driver Ids
    1, 108
];

function rowConverter(d) {
    if (d.driverId == driverList[1] || d.driverId == driverList[0])
        {
            return {
                dName: d.driverName,
                dId: +d.driverId,
                dPointYears: [
                [2004,+d.driverPoints2004],
                [2005,+d.driverPoints2005],
                [2006,+d.driverPoints2006],
                [2007,+d.driverPoints2007],
                [2008,+d.driverPoints2008],
                [2009,+d.driverPoints2009],
                [2010,+d.driverPoints2010],
                [2011,+d.driverPoints2011],
                [2012,+d.driverPoints2012],
                [2013,+d.driverPoints2013],
                [2014,+d.driverPoints2014],
                [2015,+d.driverPoints2015],
                [2016,+d.driverPoints2016],
                [2017,+d.driverPoints2017],
                [2018,+d.driverPoints2018],
                [2019,+d.driverPoints2019],
                [2020,+d.driverPoints2020],
                [2021,+d.driverPoints2021],
                [2022,+d.driverPoints2022]
                ]
            }   
        }
}

var startYear = 2004;
var endYear = 2022;

var years = [/*2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,*/ 2017, 2018, 2019, 2020, 2021, 2022]


// gridlines in x axis function
function make_x_gridlines() {
  return d3.axisBottom(xScale).ticks(0).tickSizeOuter(0);
}

// gridlines in y axis function
function make_y_gridlines() {
  return d3.axisLeft(yScale).ticks(0).tickSizeOuter(0);
}

// This function parses the data using rowConverter and makes the bar chart based on that data
d3.csv("data/F1data.csv", rowConverter).then(function (data) {
  console.log(data);
  //    var cities = data.columns.slice(1).map(function(id) {
  //    return {
  //      id: id,
  //      values: data.map(function(d) {
  //        return {date: d["Country Name"], EPC: d[id]};
  //      })
  //    };
  //  });

  var idx = 0;

  // Setting the ranges for the x domain, y domain, and color domain
  xScale.domain([2004, 2022]);
  yScale.domain([0, 600]);

  // Setting the color domain from 0 to 5 because there are 6 countries that need 6 different colors
  colorScale.domain([0, 1]);
  //    x.domain(data.map(function(d){ return d.years[idx++][0]; }));

  // add the X gridlines
  for (let x = 50; x < endYear; x += 50) {
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + yScale(x) + ")")
      .call(make_x_gridlines().tickSize(0).tickFormat(""));
  }
  // add the Y gridlines
  for (let x = startYear; x < endYear; x += 1) {
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", "translate(" + xScale(x) + ",0)")
      .call(make_y_gridlines().tickSize(0).tickFormat(""));
  }

  // the d3.line() function returns a line so we save it to lineGen
  var lineGen = d3
    .line()
    .x(function (d) { //year
      return xScale(d[0]);
    })
    .y(function (d) { //points
      return yScale(d[1]);
    });

  // Uses the curve basis on the lines
  lineGen.curve(d3.curveBasis);

  var line;
  group = svg.append("g").attr("class", "countryLines");

  // Goes through each individual line
  for (let x = 0; x < 2; x++) {
    // Creates the path with the country
    line = group
      .append("path")
      .attr("class", data[x][0] + " line")
      .attr("d", lineGen(data[x]["dPointYears"]))
      .attr("stroke", colorScale(x))
      .attr("stroke-width", "2")
      .attr("fill", "none");

    // Sets the state before animations
    line
      .attr("stroke-dashoffset", line.node().getTotalLength())
      .attr("stroke-dasharray", line.node().getTotalLength());

    // Animation
    line
      .transition()
      .delay(x + 1000)
      .duration(1000)
      .attr("stroke-dashoffset", "0");

    // Adds the country labels to the side of the lines
    text = group
      .append("text")
      .attr("class", "countryLabel")
      .text(data[x]["dName"])
      .attr("y", yScale(data[x]["dPointYears"][2022-2004][1]))
      .attr("x", chart_width + 10)
      .attr("font-size", "14px");
    // .style("opacity")
  }

  // Draw xAxis and position the label
  svg
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + chart_height + ")")
    .call(xAxis);

  // Draw yAxis and position the label
  svg
    .append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + 0 + ",0)")
    .call(yAxis);

  // This function creates the y-axis label, and positions it near the y-axis with respect to the margins,
  // and based on the pre-defined height
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.leftx)
    .attr("x", 0 - chart_height / 2)
    .attr("dy", "-2.8em")
    .style("text-anchor", "middle")
    .text("Points")
    .attr("font-size", "14px");

  // Adding the Year label on y axis
  svg
    .append("text")
    .attr("y", 0 - margin.leftx)
    .attr("x", chart_width)
    .attr("dy", "-2.8em")
    .text("Year")
    .attr("font-size", "14px");
});
