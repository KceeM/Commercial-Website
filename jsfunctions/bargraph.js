document.addEventListener('DOMContentLoaded', function() {
    fetch('plantbasedproducts_growth.json')
        .then(response => response.json())
        .then(data => createBarGraph(data))
        .catch(error => console.error("Error loading data:", error));
});

function createBarGraphs(yearlyData, productData) {
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Graph 1: Sales Growth by Year
    const svg1 = d3.select("#yearly-sales-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x1 = d3.scaleBand()
        .domain(yearlyData.map(d => d.year))
        .range([0, width])
        .padding(0.1);

    const y1 = d3.scaleLinear()
        .domain([0, d3.max(yearlyData, d => d.sales)])
        .nice()
        .range([height, 0]);

    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x1))
        .append("text")
        .attr("y", 40)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("Year");

    svg1.append("g")
        .call(d3.axisLeft(y1))
        .append("text")
        .attr("y", -50)
        .attr("x", -height / 2)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("Sales (in billion USD)");

    svg1.selectAll(".bar")
        .data(yearlyData)
        .enter().append("rect")
        .attr("x", d => x1(d.year))
        .attr("y", d => y1(d.sales))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y1(d.sales))
        .attr("class", "bar");

    // Graph 2: Product Sales and Forecast
    const svg2 = d3.select("#product-sales-forecast-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x2 = d3.scaleBand()
        .domain(productData.map(d => d.productType))
        .range([0, width])
        .padding(0.1);

    const y2 = d3.scaleLinear()
        .domain([0, d3.max(productData, d => d.forecast)])
        .nice()
        .range([height, 0]);

    svg2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x2))
        .append("text")
        .attr("y", 40)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("Product Type");

    svg2.append("g")
        .call(d3.axisLeft(y2))
        .append("text")
        .attr("y", -50)
        .attr("x", -height / 2)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("Sales (in billion USD)");

    // Bars for sales and forecast
    svg2.selectAll(".bar-sales")
        .data(productData)
        .enter().append("rect")
        .attr("x", d => x2(d.productType))
        .attr("y", d => y2(d.sales))
        .attr("width", x2.bandwidth() / 2)
        .attr("height", d => height - y2(d.sales))
        .attr("class", "bar-sales")
        .attr("fill", "green");

    svg2.selectAll(".bar-forecast")
        .data(productData)
        .enter().append("rect")
        .attr("x", d => x2(d.productType) + x2.bandwidth() / 2)
        .attr("y", d => y2(d.forecast))
        .attr("width", x2.bandwidth() / 2)
        .attr("height", d => height - y2(d.forecast))
        .attr("class", "bar-forecast")
        .attr("fill", "orange");
}