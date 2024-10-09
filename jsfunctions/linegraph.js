document.addEventListener('DOMContentLoaded', function() {
    d3.json("veganvegetariandata.json").then(function(veganData) {
        createLineGraph(veganData);
    }).catch(function(error) {
        console.error("Error loading vegan data:", error);
    });
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

    const x = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.vegans_percentage, d.vegetarians_percentage))])
        .nice()
        .range([height, 0]);

    // Adds axes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Line generators for vegans and vegetarians
    const lineVegans = d3.line()
        .x(d => x(d.country) + x.bandwidth() / 2)
        .y(d => y(d.vegans_percentage));

    const lineVegetarians = d3.line()
        .x(d => x(d.country) + x.bandwidth() / 2)
        .y(d => y(d.vegetarians_percentage));

    // vegetarian lines first
    svg.append("path")
    .datum(data)
    .attr("class", "line vegetarians")
    .attr("d", lineVegetarians)
    .style("fill", "none")
    .style("stroke", "orange")
    .style("stroke-width", 2);

    //vegan lines 2nd
    svg.append("path")
    .datum(data)
    .attr("class", "line vegans")
    .attr("d", lineVegans)
    .style("fill", "none")
    .style("stroke", "greenyellow")
    .style("stroke-width", 2);

    // Tooltip functionality for vegans and vegetarians
    const tooltip = d3.select("#tooltip1");

    // Adds circles for vegans
    svg.selectAll(".dot-vegans")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot-vegans")
        .attr("cx", d => x(d.country) + x.bandwidth() / 2)
        .attr("cy", d => y(d.vegans_percentage))
        .attr("r", 5)
        .style("fill", "green")
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                .html(`${d.country}<br>Vegans: ${d.vegans_percentage}%`);
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    // Add circles for vegetarians
    svg.selectAll(".dot-vegetarians")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot-vegetarians")
        .attr("cx", d => x(d.country) + x.bandwidth() / 2)
        .attr("cy", d => y(d.vegetarians_percentage))
        .attr("r", 5)
        .style("fill", "orange")
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                .html(`${d.country}<br>Vegetarians: ${d.vegetarians_percentage}%`);
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    //x-axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10) // Position below the axis
        .text("Countries")
        .style("font-size", "14px")
        .style("fill", "black");

    //y-axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15) // Position to the left of the axis
        .text("Percentage Values")
        .style("font-size", "14px")
        .style("fill", "black");
        

}