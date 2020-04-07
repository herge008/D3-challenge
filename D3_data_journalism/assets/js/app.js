// @TODO: YOUR CODE HERE!

//==========================================================================================
// Bring in d3-tip code (for bonus section)
//==========================================================================================

var tip = d3.tip().attr("class", "d3-tip");

//==========================================================================================
// SVG wrapper and dimensions
//==========================================================================================

var svgWidth = 1000;
var svgHeight = 1000;

var margin = {
  top: 25,
  right: 50,
  bottom: 100,
  left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//==========================================================================================
// Append SVG element
//==========================================================================================

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//==========================================================================================
// Append group elements
//==========================================================================================

var chartGroup = svg
  .append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Call d3-tip code
chartGroup.call(tip);

var tooltips;
var bottomAxisGroup = chartGroup
  .append("g").attr("transform", `translate(0, ${height})`);
var leftAxisGroup = chartGroup.append("g");
var circles;

//==========================================================================================
// Append axes
//==========================================================================================

// X-axis variables are in the order in which they appear (top to bottom) on the example graph provided in instructions
var povertyAxis = chartGroup
  .append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("In Poverty (%)")
  .classed("axis-label", true);
var ageAxis = chartGroup
  .append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("Age (Median)")
  .classed("axis-label", true);
var incomeAxis = chartGroup
  .append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 60})`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("Household Income (Median)")
  .classed("axis-label", true);

// Y-axis variables are in the order in which they appear (right to left) on the example graph provided in instructions
  var healthcareAxis = chartGroup
  .append("text")
  .attr("transform", `translate(-30, ${height / 2}) rotate(-90)`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("Lacks Healthcare (%)")
  .classed("axis-label", true);
var smokeAxis = chartGroup
  .append("text")
  .attr("transform", `translate(-50, ${height / 2}) rotate(-90)`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("Smoke (%)")
  .classed("axis-label", true);
var obesityAxis = chartGroup
  .append("text")
  .attr("transform", `translate(-70, ${height / 2}) rotate(-90)`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("Obese (%)")
  .classed("axis-label", true);

//==========================================================================================
// Create chart
//==========================================================================================

const graph = (data, x = "poverty", y = "healthcare") => {
    var xLinearScale = d3
      .scaleLinear()
      .range([0, width])
      .domain([d3.min(data, (d) => d[x]), d3.max(data, (d) => d[x])]);
    var yLinearScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([d3.min(data, (d) => d[y]), d3.max(data, (d) => d[y])]);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    bottomAxisGroup.transition().duration(500).call(bottomAxis);
    leftAxisGroup.transition().duration(500).call(leftAxis);
    circles
      .transition()
      .duration(500)
      .attr("cx", (d) => xLinearScale(d[x]))
      .attr("cy", (d) => yLinearScale(d[y]))
      .attr("r", 10)
      .style("fill", "#8cc8ff");
    text
      .transition()
      .duration(500)
      .attr("dy", (d) => yLinearScale(d[y]) + 4)
      .attr("dx", (d) => xLinearScale(d[x]))
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .style("stroke-width", "10px")
      .style("fill", "white");
  
    //******************************************************************
    // X-axis
    //******************************************************************
    povertyAxis.classed("active", x == "poverty").on("click", () => {
      graph(data, "poverty", y);
    });
  
    ageAxis.classed("active", x == "age").on("click", () => {
      graph(data, "age", y);
    });
  
    incomeAxis.classed("active", x == "income").on("click", () => {
      graph(data, "income", y);
    });
  
    //******************************************************************
    // Y-axis
    //******************************************************************
    healthcareAxis.classed("active", y == "healthcare").on("click", () => {
      graph(data, x, "healthcare");
    });
  
    smokeAxis.classed("active", y == "smokes").on("click", () => {
      graph(data, x, "smokes");
    });
  
    obesityAxis.classed("active", y == "obesity").on("click", () => {
      graph(data, x, "obesity");
    });
  
    //******************************************************************
    // Tooltip
    //******************************************************************
    tip.html(
      (d) =>
        "<p style='font-weight:bold;font-size:15px'>" +
        d.state +
        "</p>" +
        "<p>" +
        x +
        ": " +
        d[x] +
        "</p><p>" +
        y +
        ": " +
        d[y] +
        "</p>"
    );
  };

//==========================================================================================
// Inject data and chart
//==========================================================================================

d3.csv("./assets/data/data.csv").then((data) => {
    console.log(data);
    data.forEach(function (d) {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
      d.smokes = +d.smokes;
      d.obesity = +d.obesity;
      d.age = +d.age;
      d.income = +d.income;
    });
  
    circleGroup = chartGroup
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("g")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
    circles = circleGroup.append("circle");
    text = circleGroup.append("text").text((d) => d.abbr);
    graph(data);
  });