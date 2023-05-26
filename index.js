const padding = 100
const width = 1100
const height = 700
const parser = d3.timeParse("%M:%S")

const svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height)

const chart = async () => {
    await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {

// create + append scales/axes/legend
 const xScale = d3.scaleTime()
        .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
        .range([padding, width - padding])

const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format(""));

svg.append('g')
        .call(xAxis) 
        .attr("id", "x-axis")
        .attr("transform", 'translate(0,  ' + (height - padding) + ')')

const yScale = d3.scaleTime()
        .domain([d3.max(data, (d) => new Date(parser(d.Time))), d3.min(data, (d) => new Date(parser(d.Time)))])
        .range([height/1.4, 0]) 

const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat(d3.timeFormat('%M:%S'))

svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', ' + padding + ')')

svg.append('div')
        .attr('id', 'legend')
// add data points to graph 

svg.selectAll('circle')
        .data(data)
        .join('circle')
        .attr('class', 'dot')
        .attr('r', (d, i) => 5)
        .attr('cx', (d, i) => {
            return xScale(d.Year)
        })
        .attr('cy', (d, i) => {
            return yScale(new Date(parser(d.Time)))
        })
       .attr('transform', 'translate(0, ' + padding + ')')
       .attr("data-xvalue", (d, i) => {
            return d.Year
       })
        .attr("data-yvalue", (d, i) => {
            return new Date(parser(d.Time))
       })
 })
}

chart()