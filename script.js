d3.csv('driving.csv', d3.autoType).then(_data=>{
	data = _data;
	console.log(data);
    
    const margin = {top:30, left:30, bottom:30, right:30};
    const width = 650- margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const padding = 9;

    const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleLinear()
    .domain(d3.extent(data, (d)=>{return d.miles;})).nice()
    .range([0,width])
  
    const yScale = d3.scaleLinear()
    .domain(d3.extent(data, (d)=>{return d.gas;})).nice()
    .range([height,0])

    const xAxis = d3.axisBottom()
    .ticks(5,"s")
    .tickFormat(d3.format(",.0f"))
    .scale(xScale);
    
    const yAxis = d3.axisLeft()
    .tickFormat(d3.format("$.2f"))
	.scale(yScale);

    const line = d3
    .line()
    .x((d) => { return xScale(d.miles) })
    .y((d) => { return yScale(d.gas) })

    function halo(text) {
        text
            .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
            })
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 4)
            .attr("stroke-linejoin", "round");
        }

    svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(${padding}, ${height})`)
    .call(xAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line")
        .clone()
        .attr("y2", 0 - height)
        .attr("stroke-opacity", 0.1)
    )
    .call(g => g.selectAll(".tick text")
        .attr("font-size", 11.5)
        .call(halo)
    )
    .call(g=>
        g.append("text")
        .attr("class", "label")
        .attr('x', 430)
        .attr('y', -5)
        .attr('font-family','sans-serif')
        .attr('font-size', 12)
        .attr('fill', 'black')
        .attr('text-anchor','start')
        .text("Miles per person per year")
        .call(halo)
    );
    
    svg.append("g")
	.attr("class", "axis y-axis")
    .attr("transform", `translate(${padding}, 0)`)
	.call(yAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line")
        .clone()
        .attr("x2", width)
        .attr("stroke-opacity", 0.1)
    )
    .call(g => g.selectAll(".tick text")
        .attr("class", "ytick")
        .attr("font-size", 11.5)
        .call(halo)
    )
    .call(g=>
        g.append("text")
        .attr("class", "label")
        .attr('x', 8)
        .attr('y', 6)
        .attr('font-family','sans-serif')
        .attr('font-size', 12)
        .attr('fill', 'black')
        .attr('text-anchor','start')
        .text("Cost per gallon")
        .call(halo)
    );

    svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("d", line);

   function position(d) {
        const t = d3.select(this);
        switch (d.side) {
          case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
          case "right":
            t.attr("dx", "0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "start");
            break;
          case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
          case "left":
            t.attr("dx", "-0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "end");
            break;
        }
    }

    svg.selectAll('.chart')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d  => xScale(d.miles))
    .attr('cy', d => yScale(d.gas))
    .attr('r', 3)
    .attr('stroke', 'black')
    .attr('fill', 'white')

    svg.selectAll(".chart")
    .data(data)
    .enter()
    .append("text")
    .attr('x', d => xScale(d.miles))
    .attr('y', d => yScale(d.gas))
    .attr("font-size", 11.5)
    .text(function(d){
        return d.year
    })
    .each(position)
    .call(halo)


})