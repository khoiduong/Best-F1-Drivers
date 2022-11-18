/*
Pan+Drag:  Achieved by using svg.zoom, which was defined using the d3.event.transform.rescaleX (and Y) function.
            This also required saving the append calls of the dots and text as variables to be altered in the zoom function

Tooltip:   Defined the style in the css. Text was formatted to align country name to the middle and parameters on each side. achieved using the on('mouseover'), on('mousemove'), and on('mouseout') functions. Used mousemove to make the tooltip actively follow the mouse cursor. Was unable to make the tooltip pan with the dots.

*/    


//Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;




    //Tooltip
    var div = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    //Define SVG
      var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define Scales   
    var xScale = d3.scaleLinear().range([0, width]);

    var yScale = d3.scaleLinear().range([height, 0]);
    
    
      
       //Define Axis

    var xAxis = d3.axisBottom(xScale).tickPadding(2);
    var yAxis = d3.axisLeft(yScale).tickPadding(2);
    
    //Get Data
    
 function rowConverter(data) {
    return {
        country : data.country,
        gdp : +data.gdp,
        population : +data.population,
        epc : +data.ecc,
        ec : +data.ec
    }
}



d3.csv("data/scatterdata.csv",rowConverter).then(function(data) {
    console.log(data)
    
    // Define domain for xScale and yScale

    xScale.domain([0, d3.max(data.map(function(d){ return d.gdp; })) + 1]);
//    xScale.domain(data.map(function(d){ return d.gdp; }));
    yScale.domain([0,d3.max(data, function(d) {return d.epc; }) + d3.max(data, function (d) {return d.ec; })]);
    
    var colors = d3.scaleOrdinal(d3.schemeCategory10);
   
 

    // Legend Box
    var rect1 = svg.append("rect")
        .attr("x", 11 * width / 16)
        .attr("y", (4 * height / 7) - 35)
        .attr("width", 9 * width / 32)
        .attr("height", (3 * height / 7) + 25)
        .style("fill", "rgb(211, 211, 211)");
    
    // Legend Text
    var title = svg.append("text")
        .attr("x", (11 * width / 16) + 5) 
        .attr("y", (31 * height / 32) - 15) 
        .attr("dy", ".71em") 
        .style("text-anchor", "beginning") 
        .attr("font-size", "16px") 
        .text("Total Energy Consumption")
        .style("fill", "rgb(21, 139, 59)");
    
    // 100 Trillion Circle
    var c1 = svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .style("stroke", "white")
        .style("fill", "white")
        .attr("r", 10 * Math.sqrt(100 / Math.PI))
        .attr("cx", 14 * width / 16)
        .attr("cy", 25 * height / 32);
    
    var t1 = svg.append("text")
        .attr("x", 11.9 * width / 16) 
        .attr("y", (25 * height / 32) - 10) 
        .attr("dy", ".71em") 
        .style("text-anchor", "middle") 
        .attr("font-size", "12px") 
        .text("100 Trillion BTUs"); 
    
    // 10 Trillion Circle
    var c2 = svg.append("circle")
        .style("stroke", "white")
        .style("fill", "white")
        .attr("r", 10 * Math.sqrt(10 / Math.PI))
        .attr("cx", 14 * width / 16)
        .attr("cy", (19 * height / 32) - 5);
    
    var t2 = svg.append("text")
        .attr("x", 11.9 * width / 16) 
        .attr("y", (19 * height / 32) - 10) 
        .attr("dy", ".71em") 
        .style("text-anchor", "middle") 
        .attr("font-size", "12px") 
        .text("10 Trillion BTUs");
    
    // 1 Trillion Circle
    var c3 = svg.append("circle")
        .style("stroke", "white")
        .style("fill", "white")
        .attr("r", 10 * Math.sqrt(1 / Math.PI))
        .attr("cx", 14 * width / 16)
        .attr("cy", (17 * height / 32) - 7);
    
    var t3 = svg.append("text")
        .attr("x", 11.9 * width / 16) 
        .attr("y", (17 * height / 32) - 10) 
        .attr("dy", ".71em") 
        .style("text-anchor", "middle") 
        .attr("font-size", "12px") 
        .text("1 Trillion BTUs");
    

    
    //Draw Scatterplot
    var view = svg.selectAll(".dot") 
        .data(data) 
        .enter()
        .append("circle") 
        .attr("class", "dot") 
        .attr("r", function (d) {return 10 * Math.sqrt(d.ec / Math.PI) ; }) 
        // Re-define r so that the area of circle is proportional  
        // to total gdp 
        .attr("cx", function(d) { return xScale(d.gdp);}) 
        .attr("cy", function(d) { return yScale(d.epc);}) 
        .style("fill",function (d) {return colors(d.country);})
    
        // Handles the tooltip mouse events
        .on('mouseover', function (d) {
            div
                .transition()
                .duration(200)
                .style('opacity', 0.9);
            div
                .html('<center>' + d.country + '</center> <br/> <left>Population</left> <right>:' + d.population + ' Million</right> <br/><left>GDP</left> <right> :$' + d.gdp + ' Trillion</right> <br/> <left>EPC<left> <right>:' + d.epc + ' Million BTUs</right> <br/> <left>Total</left> <right>:' + d.ec + "Trillion BTUs </right>")
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY - 28 + 'px')
        })
        // Kepps the tooltip on the mouse's position even when it moves
        .on('mousemove', function() {
            div
                .style("top", (d3.event.pageY)+"px")
                .style("left",(d3.event.pageX-28)+"px")

        })
        .on('mouseout', function () {
            div
                .transition()
                .duration(500)
                .style('opacity', 0);

     });
    
// Adds the country names to the circles
var cName = svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
        .attr("fill", "black")
        .text(function (d) {return d.country; });
    
    // x-axis 
var gX = svg.append("g") 
        .attr("class", "x axis") 
        .attr("transform", "translate(0," + height + ")") 
        .call(xAxis) 
     svg.append("text") 
        .attr("class", "label") 
        .attr("x", width/2) 
        .attr("y", height + 50) 
        .style("text-anchor", "middle") 
.attr("font-size", "12px") 
        .text("GDP (in Trillions of US Dollars) in 2010"); 
 
  // y-axis 
var gY = svg.append("g") 
      .attr("class", "y axis") 
      .call(yAxis) 
  svg.append("text") 
      .attr("class", "label") 
      .attr("transform", "rotate(-90)") 
      .attr("x", -50) 
      .attr("y", -50) 
      .attr("dy", ".71em") 
      .style("text-anchor", "end") 
      .attr("font-size", "12px") 
      .text("Energy Consumption per Capita (in Million BTUs per Person ");
    
    // Define zoom and its parameters, such as how much it can zoom and how much it can pan
    var zoom = d3.zoom()
        .scaleExtent([1, 40])
        .translateExtent([[-width, -width], [width + 300, height + 200]])
        .on("zoom", zoomed);
    
    
    
    svg.call(zoom);
    
    // Determines which elements are affected by the zoom
    function zoomed() {
//        rect1.attr("transform", (d3.event.transform));
//        title.attr("transform", (d3.event.transform));
//        c1.attr("transform", (d3.event.transform));
//        c2.attr("transform", (d3.event.transform));
//        c3.attr("transform", (d3.event.transform));
//        t1.attr("transform", (d3.event.transform));
//        t2.attr("transform", (d3.event.transform));
//        t3.attr("transform", (d3.event.transform));
        view.attr("transform", (d3.event.transform));
        cName.attr("transform", (d3.event.transform));
        div.attr("transform", (d3.event.transform));
        gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)))
        gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)))
    }
 
})




                             