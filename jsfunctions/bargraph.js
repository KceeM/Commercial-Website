document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'ef0323f5045049b28c111ce2a02c9687'; // API key from Spoonacular API

    // Fetches product data
    fetch(`https://api.spoonacular.com/food/products?apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => createBarGraph(data.products)) 
        .catch(error => console.error("Error loading product data:", error));
});

function createBarGraph(data) {
    const margin = {top: 20, right: 30, bottom: 40, left: 40};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#bar-graph-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.productName)) //productName data
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)]) //sales data
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.productName)) // ensures productName exists
        .attr("y", d => y(d.sales)) // ensures sales exists
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.sales))
        .on("mouseover", function(event, d) {
            d3.select(this).style("fill", "orange"); // changes color on hover
        })
        .on("mouseout", function(event, d) {
            d3.select(this).style("fill", "green"); // revert color
        });
}