document.addEventListener('DOMContentLoaded', function() {
    fetch("https://api.spoonacular.com/recipes/complexSearch?diet=vegan&apiKey=ef0323f5045049b28c111ce2a02c9687")
    .then(response => response.json())
    .then(data => {
        const processedData = data.results.map((item, index) => ({
            name: item.title,
            popularity: item.spoonacularScore,
            rank: index + 1  
        }));
        createLineGraph(processedData);
    })
    .catch(error => console.error("Error fetching data:", error));
});


function createLineGraph(data) {
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#line-graph-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scalePoint()
        .domain(data.map(d => d.rank))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.popularity)])
        .nice()
        .range([height, 0]);

    // Adds axes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat((d, i) => data[i].name))
        .selectAll("text")  
        .style("text-anchor", "end")  // Align text
        .attr("dx", "-0.8em")  // Adjust horizontal pos
        .attr("dy", "0.15em")  // Adjust vertical pos
        .attr("transform", "rotate(-65)");  // Rotate text at an angle of -65 degrees(wanted 90 but it did not look good)
        

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(d.rank))
        .y(d => y(d.popularity));

    

    // Tooltip functionality for vegans and vegetarians
    const tooltip = d3.select("#tooltip1");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "green")
        .style("stroke-width", 2);

    
        

}