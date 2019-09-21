// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 40,
    bottom: 60,
    left: 30
  };

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from data.csv
d3.csv("data/data.csv", function(error, cencusData) {

    // Log an error if one exists -  if( error) throw error;
    if (error) return 
        console.warn(error);

    // Cast the value to a number for each piece of Data
    cencusData.forEach(function(data) {
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
  });
    // Print the Data
    console.log(cencusData);

    // Create a scale for your independent (x) coordinates
    var xScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d["poverty"] -1),
            d3.max(cencusData, d => d["poverty"])])
        .range([0, svgWidth]);

    console.log("x-axis data");
    console.log(d3.min(censusData, d =>d["poverty"]));
    console.log(d3.max(censusData, d =>d["poverty"]));

    console.log("y-axis data");
    console.log(d3.min(censusData, d=>d["healthcare"]));
    console.log(d3.max(censusData, d =>d["healthcare"]));

    console.log(d3.min(censusData, d =>d["obesity"]));
    console.log(d3.max(censusData, d =>d["obesity"]));

    // Create a scale for your dependent (y) coordinates
    var yScale = d3.scaleLinear()
        .domain([0, d3.min(cencusData, d => d["healthcare"]-1),
            d3.max(cencusData, d => d["healthcare"])])
        .range([svgHeight, 0]);


    // define axis 
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // set x to the bottom of the chart and create group
    var x = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);
    
    // initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")

        //define postition
        .offset([80, -60])

        //html method allow to mix javascrip with HTML in  callback function
        .html(function (data){
            var stateName = data.state;
            var pov = +data.poverty;
        });

    chartGroup.call(toolTip);

    // set y to the y axis
    chartGroup.append("g")
        .call(yAxis);
    
    // Append Data to chartGroup
    var gdots = chartGroup.selectAll("g.dot")
            .data(censusData)
            .enter()
            .append("g");
    
    gdots.append("circle")
        .attr("cx", d => xScale(d["poverty"]))
        .attr("cy", d => yScale(d["healthcare"]))
        .attr("r", d => d.obesity/2)
        .attr("fill", "steelblue")
        .attr("opacity", ".5")
        //tooltip show
        .on("mouseenter", function(data){
            toolTip.show(data)
        })
        //tooltip hide
        .on("mouseout", function(data, index){
            toolTip.hide(data);       
        });
        
    gdots.append("text").text(d=>d.abbr)
        .attr("x", d => xScale(d.poverty)-4)
        .attr("y", d => yScale(d.healthcare)+2)
        .style("font-size", ".6em")
        .classed("fill-text", true);
    
    console.log(d => xScale(d.poverty));
    console.log(d => yScale(d.healthcare));

    //create group for 2 x axis lable
    var labGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth /2}, ${chartHeight + 20})`);

    var censusDataLab = labGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value","poverty")
            .classed("active", true)
            .text("Poverty Vs. Healthcare");

        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0- chartMargin.left)
        .attr("x", 0 - (chartHeight /2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Healthcare");
});
