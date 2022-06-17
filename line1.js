//Create SVG element
var svg = d3.select("#chart-1 .chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip1 = d3.select("#chart-1")
  .append('div')
  .style('visibility', 'hidden')
  .attr('class', 'my-tooltip')
  .attr('id', 'tooltip-1')

// Add Y scale
var yScale1 = d3.scaleLinear()
  .domain([6, 0])
  .range([0, height - (margin.top + margin.bottom)])

// Define Y axis and format tick marks
var yAxis1 = d3.axisLeft(yScale1)
  .ticks(6)
  .tickFormat(d => d == 0 ? 0 : d + 'M')

var yGrid1 = d3.axisLeft(yScale1)
  .tickSize(-width + margin.right + margin.left, 0, 0)
  .tickFormat("")

// Render Y grid
svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid1)

// Render Y axis
svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr('class', 'y-axis')
  .call(yAxis1)
  .selectAll("text")
  .style('font-size', () => {
    return window.innerWidth > 767 ? '9pt' : '8pt'
  })
  .attr("transform", "translate(-15,0)")
  .style("text-anchor", "middle")

svg.append("text")
  .attr("class", "y-label")
  .attr("text-anchor", "middle")
  .attr("transform", `translate(${20},${(height-margin.bottom)/2}) rotate(-90)`)
  .style('font-size', '11pt')
  .style('fill', 'black')
  .text('Aggregate pro bono hours');

// Render Y grid
svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid1)

// Render lines g
var linesG = svg.append("g")
  .attr('class', 'lines')

//Render X axis
svg.append("g")
  .attr("transform", `translate(0,${height-margin.bottom})`)
  .attr('class', 'x-axis')
  .style('color', 'black')
  .call(xAxis)
  .selectAll(".tick text")
  .style('font-size', '10pt')
  .raise()

d3.csv("data-1.csv")
  .then(function(csv) {

    var line = d3.line()
      .x(function(d) {
        return xScale(d.year)
      })
      .y(function(d) {
        return (height - margin.bottom) - yScale1(Math.max.apply(Math, yScale1.domain()) - d.count);
      });


    svg.select('.lines')
      .data([csv])
      .append("path")
      .attr("class", "line")
      .attr("d", (d) => {
        return line(d)
      })
      .style('stroke', '#b01116')


    csv.unshift('dummy')

    svg.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", d => `dot yr-${d.year}`) // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale1(Math.max.apply(Math, yScale1.domain()) - d.count);
      })
      .attr("cx", function(d) {
        return xScale(d.year)
      })
      .attr("r", 3)
      .style('fill', '#b01116')

    svg.append("rect")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("class", "hover-overlay")
      .attr("width", width - margin.right - margin.left)
      .attr("height", height - margin.bottom - margin.top)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .data([csv])
      .on("mouseover mousemove touchstart touchmove", function(d) {
        return mouseoverLine(d, 1)
      })
      .on("mouseout", () => {
        svg.selectAll('.dot')
          .attr('r', 3)

        d3.select(`#tooltip-1`)
          .html("")
          .attr('display', 'none')
          .style("visibility", "hidden")
          .style("left", null)
          .style("top", null);
      });

    d3.selectAll('.hover-overlay')
      .raise()
  })