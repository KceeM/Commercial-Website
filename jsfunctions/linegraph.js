document.addEventListener('DOMContentLoaded', function() {
    fetch("https://api.spoonacular.com/recipes/complexSearch?diet=vegan&apiKey=ef0323f5045049b28c111ce2a02c9687")
    .then(response => response.json())
    .then(data => {
        const processedData = data.results.map((item, index) => ({
            name: item.title,
            popularity: item.spoonacularScore  || item.healthScore,
            rank: index + 1  
        }));
        createLineGraph(processedData);
    })
    .catch(error => console.error("Error fetching data:", error));
});


function createLineGraph(data) {
    const margin = {top: 20, right: 30, bottom: 80, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#line-graph-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
    const x = d3.scaleLinear()
        .domain([1, data.length])  // linear scale for ranks
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.popularity)])
        .nice()
        .range([height, 0]);

    // Adds axes, this is for x-axis & text rotation
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(data.length).tickFormat((d, i) => data[i] ? data[i].name : ""))
        .selectAll("text")  
        .style("text-anchor", "end")  // Align text
        .attr("dx", "-0.8em")  // Adjust horizontal pos
        .attr("dy", "0.15em")  // Adjust vertical pos
        .attr("transform", "rotate(-45)")  // Rotate text at an angle of -65 degrees(wanted 90 but it did not look good)
        .style("white-space", "nowrap");

    // This is for y-axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Line path
    const line = d3.line()
        .x(d => x(d.rank))
        .y(d => y(d.popularity));


    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "green")
        .style("stroke-width", 2);


    // Tooltip functionality
    const tooltip = d3.select("#tooltip1");
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.rank))
        .attr("cy", d => y(d.popularity))
        .attr("r", 5)
        .style("fill", "orange")
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1)
                   .html(`Recipe: ${d.name}<br>Popularity: ${d.popularity}`)
                   .style("left", `${event.pageX + 10}px`)
                   .style("top", `${event.pageY - 30}px`);
        })
        .on("mouseout", () => tooltip.style("opacity", 0));
        

}