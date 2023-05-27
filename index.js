const padding = 100
const width = 1100
const height = 700
const parser = d3.timeParse("%M:%S")

// create svg + title
const svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

svg.append('text')
        .text('Doping in Profession Bicycle Racing')
        .attr('x', padding * 3)
        .attr('y', padding/2)
        .style('font-size', '35px')

svg.append('text')
        .text("Fastest times up Alpe d'Huez")
        .attr('x', padding * 4)
        .attr('y', 85)
        .style('font-size', '25px')

// get data
const chart = async () => {
    await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {

// create scales/axes
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

svg.append('text')
        .text('Time in Minutes')
 	    .attr("transform", "rotate(-90)")
        .attr("x",  - padding*4)
	    .attr("y", padding/2)
        .attr("font-size", "20px")

svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', ' + padding + ')')

// create tooltip
const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')

// create legend
const legend = svg.append('g')
         .attr('id', 'legend')

legend.append('text')
        .text('Doping Allegations')
        .attr('x', 855)
        .attr('y', height/2 + 20)
        
legend .append('rect')
        .attr('x', 838)
        .attr('y', 359)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', 'blue')
        
 legend.append('text')
        .text('No Doping Allegations')
        .attr('x', 855)
        .attr('y', height/2)
        
legend .append('rect')
        .attr('x', 838)
        .attr('y', 339)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', 'red')            
      
// add data points to graph 
svg.selectAll('circle')
        .data(data)
        .join('circle')
        .attr('class', 'dot')
        .style('stroke', 'black')
        .style('opacity', '.8')
        .attr('r', (d, i) => 6)
        .attr('cx', (d, i) => {
            return xScale(d.Year)
        })
        .attr('cy', (d, i) => {
            return yScale(new Date(parser(d.Time)))
        })
       .attr('transform', 'translate(0, ' + padding + ')')
       .attr('data-xvalue', (d, i) => {
            return d.Year
       })
        .attr('data-yvalue', (d, i) => {
            return new Date(parser(d.Time))
       })
       .attr('fill', (d, i) => {
         if (d.URL == "") {
            return 'red'
         }
         else {
            return 'blue'
         }
      })
        .on('mouseover', (event, d) => {
           tooltip
           .html(`${d.Name}: ${d.Nationality} <br> Place: ${d.Place} <br> Year: ${d.Year} <br> ${d.Doping}`)
           .style('opacity', .9)
           .style('position', 'absolute')
           .style('left', (event.pageX + 25) + 'px')
           .style('top', (event.pageY - 55) + 'px')
           .style('background-color', 'aquamarine')
           .attr('data-year', d.Year)
       })
        .on('mouseout', () => {
            tooltip
            .style("opacity", 0)
          })
 })
}

chart()