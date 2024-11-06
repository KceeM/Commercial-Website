document.addEventListener('DOMContentLoaded', function() {
    // Sample data to test the bar chart
    const diseaseData = [
        { disease: "Colorectal Cancer", cases: 45 },
        { disease: "Heart Disease", cases: 60 },
        { disease: "Type 2 Diabetes", cases: 40 }
    ];
    
    createBarGraph(diseaseData);
});

// Function to create the bar graph (using D3.js)
function createBarGraph(diseaseData) {
    const width = 500, height = 300;
    const svg = d3.select("#graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .domain(diseaseData.map(d => d.disease))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(diseaseData, d => d.cases)])
        .nice()
        .range([height, 0]);

    svg.selectAll(".bar")
        .data(diseaseData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.disease))
        .attr("y", d => y(d.cases))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.cases))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));
}