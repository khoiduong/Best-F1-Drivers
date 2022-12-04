let main_body_width = parseInt(d3.select("body").style("width"));
console.log(main_body_width)
//Define Margin
var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
    width = (2 * main_body_width / 3) - margin.left -margin.right,
    height = 600 - margin.top - margin.bottom;

//Define Color
// Schemecategory20 got removed in v4
var colors = d3.scaleOrdinal(d3.schemeCategory10);

//Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Define Scales   
var xScale = d3.scaleLinear()
    .range([0, width]);

var yScale = d3.scaleLinear()
    .range([height, 0]);

var startDate = "1990-01-01";
var endDate = "2010-01-01";
var yearSelected = 2022;

var timelineScale = d3.scaleTime()
    .domain([new Date(startDate), new Date(endDate)])
    .range([margin.left, width+margin.left])
    .nice();

//Define Tooltip here
var tooltip = d3.select("body")
    .append("div")	
    .attr("class", "tooltip")

   //Define Axis
var xAxis = d3.axisBottom(xScale).tickPadding(2);
var yAxis = d3.axisLeft(yScale).tickPadding(2);

//TODO: Scale up the size of timeline axis ticks and labels to make them stand out more
var timelineAxis = d3.axisBottom(timelineScale)
    .ticks(parseInt(endDate)-parseInt(startDate));

var timelineHeight = 100;
var timelinesvg = d3.select("body")
    .append("svg")
    .attr("width", main_body_width)
    .attr("height", timelineHeight);

var timeX = timelinesvg.append("g")
    .attr("class", "timeaxis")
    .attr("transform", "translate(0," + 20 + ")")
    .call(timelineAxis);

function timelineZoomFunc() {
    timeX.call(timelineAxis.scale(d3.event.transform.rescaleX(timelineScale)));
}

var timelinezoom = d3.zoom()
    .translateExtent([[0,0],[new Date(startDate), new Date(endDate)]])
    .scaleExtent([1,1])
    .on('zoom', timelineZoomFunc);



function driverConverter(data) {
    return {
        driverId: +data.driverId,
        driverSurname: data.surname,
        driverFirstname: data.forename
    }
}

function raceConverter(data) {
    return {
        raceId: +data.raceId,
        year: +data.year
    }
}

function resultsConverter(data) {
    return {
        resRaceId: +data.raceId,
        resultId: +data.resultId,
        resDriverId: +data.driverId,
        resConstructorId: +data.constructorId
    }
}

function teamConverter(data) {
    return {
        constructorId: +data.constructorId,
        constructorName: data.name
    }
}

var drivers = []
d3.csv("data/drivers.csv", driverConverter).then(function (data) {
    for (var i = 0; i < data.length; i++) {
        drivers.push({"driverId": data[i].driverId, "driverName": (data[i].driverFirstname + " " + data[i].driverSurname)});

    }
});

var races = []
d3.csv("data/races.csv", raceConverter).then(function (data) {
    for (var i = 0; i < data.length; i++) {
        races.push({"raceId": data[i].raceId, "year": data[i].year});

    }
});

var constructors = []
d3.csv("data/constructors.csv", teamConverter).then(function (data) {
    for (var i = 0; i < data.length; i++) {
        constructors.push({"teamId": data[i].constructorId, "teamName": data[i].constructorName});

    }
});

d3.csv("data/results.csv", resultsConverter).then(function (data) {
    for (var j = 0; j < data.length; j++) {
        for (let i = 0; i < races.length; i++) {
            if (data[j].resRaceId == races[i]["raceId"] && races[i]["year"] == yearSelected) {
                 drivers[data[j].resDriverId - 1].teamId = data[j].resConstructorId;
            }
        }
    }
});

console.log(drivers);
console.log(races);
console.log(constructors);

// driverid,drivername,bestlaptime,yearbestlaptime,driverstanding,laptime2022,laptime2021,laptime2020,laptime2019
    //Get Data

function drawPlot() {
    function rowConverter(data) {
        return {
            driverid : +data.driverId,
            drivername : data.driverName,
            bestlaptime: +data.bestLapTime,
            yearbestlaptime: +data.yearbestlaptime,
            driverstanding: +data.driverStanding2022,
            driverpoints: +data.driverPoints2022,
            laptime2022: +data.laptime2022,
            laptime2021: +data.laptime2021,
            teamid: +data.constructorId2022,
            teamstanding: +data.teamstanding,
            teamname: data.constructorName
        }
    }
d3.csv("data/test.csv", rowConverter).then(function (data) {
        
    let color_domain = []
    for(let i = 0; i < data.length; i++){
        if(!color_domain.includes(data[i]["teamid"])){
            color_domain.push(data[i]["teamid"]);
        }
    }
    console.log(color_domain);
    colors.domain(color_domain);
    //console.log(color_domain);
    
    // 0 to max gdp of data
    xScale.domain([d3.min(data, function (d) { return d.bestlaptime}) - 2, 70]);
    // 0 to max ecc of data
    yScale.domain([1, d3.max(data, function (d) { return d.driverstanding})]);
    
    yAxis.ticks(d3.max(data, function (d) { return d.driverstanding}));
    
    //x axis
    
    //Draw Scatterplot
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 40])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomFunction);
    
    // view rectangle
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
    
    // Var to select shifting cirles on the scatterplot
    var shifting = svg.append("g")
        .classed("circles", true);
    
    // edited version of the js file given to us
    var newShift = shifting.selectAll("circle")
        .data(data);
    
    // Adds all data to scatterplot, along with tooltip mouseover, mousemove and mouseout
    // Also added in the html and css portions to make the table on mouseover
    // Works with double click or ctrl click for zoom in or out
    // Sliding orks with mouse click and drag
    // Zoom also works with trackpad/mouse scroller

    newShift = newShift.enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return 10*Math.sqrt((d.driverpoints/5)/Math.PI);})
        .attr("cx", function(d) {return xScale(d.bestlaptime);})
        .attr("cy", function(d) {return yScale(d.driverstanding);})
        .style("fill", function (d) { return colors(d.teamid); })
        .on("mouseover", function (d) {
        var getDriverName;
        var getTeamId = 0;
        var getTeamName;

        getDriverName = new String(drivers[d.driverid - 1]["driverName"]);
        getTeamId = d.teamid;

        
        for (let i = 0; i < constructors.length; i++) {
            if (constructors[i]["teamId"] == getTeamId) {
                getTeamName = new String(constructors[i]["teamName"]);
            }
        }
          tooltip
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 55 + "px")
            .style("display", "inline-block")
            .html('Driver: ' + d.drivername + '<br/>' + 'Team: ' + getTeamName + '<br/>' + 'Points: ' + d.driverpoints);
      })
      
      // Makes the tooltip follow the mouse when it is moved
      .on('mousemove', function(d) {
          tooltip
            .style("top", d3.event.pageY - 55 + "px")
            .style("left", d3.event.pageX + "px")

      })
    
      // Event when mouse is not longer hovering over a county
      .on("mouseout", function (d) {
        tooltip.style("display", "none");
      });
    
    var cName = svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class","label")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.bestlaptime);})
        .attr("y", function(d) {return yScale(d.driverstanding - 0.05);})
        .attr("fill", "black")
        .text(function (d) {return d.drivername});
        
    
    
    // Adds legend as seperate shapes with respective sized cirles and different text
    svg.append("rect")
        .attr("class", "rectLegend")
        .attr("x", width-220)
        .attr("y", height-260)
        .attr("width", 260)
        .attr("height", 255)
        .attr("fill", "lightgrey")
        .style("opacity", 0.9)
        .style("stroke-size", "1px");

    svg.append("text")
        .attr("class", "legendTitle")
        .attr("x", width-205)
        .attr("y", height-15)
        .style("fill", "green") 
        .attr("font-size", "16px")
        .text("Total Driver Points This Year"); 

    svg.append("circle")
        .attr("cx", width-40)
        .attr("cy", height-230)
        .attr("r", 10*Math.sqrt((10/5)/Math.PI))
        .style("fill", "white");

    svg.append("text")
        .attr("class", "legend")
        .attr("x", width-205)
        .attr("y", height-230)
        .text(" 10 points");

    svg.append("circle")
        .attr("cx", width-40)
        .attr("cy", height-190)
        .attr("r", 10*Math.sqrt((100/5)/Math.PI))
        .style("fill", "white");

    svg.append("text")
        .attr("class", "legend")
        .attr("x", width-205)
        .attr("y", height-190)
        .text(" 100 points");

    svg.append("circle")
        .attr("cx", width-40)
        .attr("cy", height-90)
        .attr("r", 10*Math.sqrt((400/5)/Math.PI))
        .style("fill", "white");

    svg.append("text")
        .attr("class", "legend")
        .attr("x", width-205)
        .attr("y", height-90)
        .text(" 400 Points");
    
    //x axis
    var gX = svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    //y axis
    var gY = svg.append("g")
        .attr("class", "y_axis")
        .call(yAxis);
    
    function zoomFunction() {
        gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
        cName.attr("transform", (d3.event.transform));
        shifting.selectAll("circle")
            .attr("transform", (d3.event.transform));
    }

    
    timelinesvg.call(timelinezoom);
    
    // call zoom on svg members of shifting
    shifting.call(zoom);

    // Add labels on both x and y axis
    svg.append("g")
        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(0," + height + ")")
        .attr("y", 30)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Best Lap Time (Seconds)");

    svg.append("g")
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -130)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Driver Standing (Track Position)");   
})

}
drawPlot();

function upYear() {
    if(yearSelected + 1 < 2023)
        {yearSelected = yearSelected + 1;}
    document.getElementById('yearSelected').innerText = yearSelected;
    svg.selectAll('*').remove();
    drawPlot();
}
function downYear() {
    if(yearSelected - 1 > 1995)
        {yearSelected = yearSelected - 1;}
    document.getElementById('yearSelected').innerText = yearSelected;
    svg.selectAll('*').remove();
    drawPlot();
}
function up5Year() {
    if(yearSelected + 5 < 2022)
        {yearSelected = yearSelected + 5;}
    document.getElementById('yearSelected').innerText = yearSelected;
    svg.selectAll('*').remove();
    drawPlot();
}
function down5Year() {
    if(yearSelected - 5 > 1995)
        {yearSelected = yearSelected - 5;}
    document.getElementById('yearSelected').innerText = yearSelected;
    svg.selectAll('*').remove();
    drawPlot();
}


function toggleDarkMode() {
    var background = document.body.style.backgroundColor;
    if (background == "white") {
        document.body.style.backgroundColor = "#0D1430";
        document.getElementById("endinfo").style.backgroundColor="#5A5A5A";
        
        svg.selectAll("g").attr("color", "white");
        svg.selectAll(".label").attr('fill', 'white');
        svg.selectAll(".legend").attr('fill', 'white');
        svg.selectAll(".legendTitle").style('fill', 'lime');
        svg.selectAll(".rectLegend").attr('fill', '#5A5A5A');
        
        timelinesvg.selectAll(".timeaxis").attr('color', 'white');
    }
    else {
        document.body.style.backgroundColor = "white";
        document.getElementById("endinfo").style.backgroundColor="lightgrey";
        
        svg.selectAll("g").attr("color", "black");
        svg.selectAll(".label").attr('fill', 'black');
        svg.selectAll(".legend").attr('fill', 'black');
        svg.selectAll(".legendTitle").style('fill', 'green');
        svg.selectAll(".rectLegend").attr('fill', 'lightgrey');
        
        timelinesvg.selectAll(".timeaxis").attr('color', 'black');
    }
}