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

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Creates lines for vegans & vegetarians
    const lineVegans = d3.line()
        .x(d => x(d.country) + x.bandwidth() / 2)
        .y(d => y(d.vegans_percentage));

    const lineVegetarians = d3.line()
        .x(d => x(d.country) + x.bandwidth() / 2)
        .y(d => y(d.vegetarians_percentage));

    // Adds lines to graph
    svg.append("path")
        .datum(data)
        .attr("class", "line vegans")
        .attr("d", lineVegans)
        .style("fill", "none")
        .style("stroke", "steelblue")
        .style("stroke-width", 2);

    svg.append("path")
        .datum(data)
        .attr("class", "line vegetarians")
        .attr("d", lineVegetarians)
        .style("fill", "none")
        .style("stroke", "orange")
        .style("stroke-width", 2);
}


//tooltip functionality
const tooltip = d3.select("#tooltip");

svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.country) + x.bandwidth() / 2)
    .attr("cy", d => y(d.vegans_percentage))
    .attr("r", 5)
    .style("fill", "steelblue")
    .on("mouseover", function(event, d) {
        tooltip.style("visibility", "visible")
            .html(`Vegans: ${d.vegans_percentage}%<br>Vegetarians: ${d.vegetarians_percentage}%`)
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
    })
    .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
    });

// Add dots for vegetarians as well
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
            .html(`Vegans: ${d.vegans_percentage}%<br>Vegetarians: ${d.vegetarians_percentage}%`)
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
    })
    .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
    });