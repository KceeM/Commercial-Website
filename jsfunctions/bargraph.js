document.addEventListener('DOMContentLoaded', function() {
    fetch('plantbasedproducts_growth.json')
        .then(response => response.json())
        .then(data => createBarGraph(data))
        .catch(error => console.error("Error loading data:", error));
});

function createBarGraph(data) {
    const margin = {top: 30, right: 30, bottom: 70, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#bar-graph-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.productType))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.forecast)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.productType))
        .attr("y", d => y(d.sales))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.sales))
        .attr("fill", "green")
        .on("mouseover", function(event, d) {
            d3.select(this).style("fill", "orange");
        })
        .on("mouseout", function(event, d) {
            d3.select(this).style("fill", "green");
        });

    svg.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => x(d.productType) + x.bandwidth() / 2)
        .attr("y", d => y(d.sales) - 10)
        .attr("text-anchor", "middle")
        .text(d => `$${(d.sales / 1e9).toFixed(1)}B`);
}