document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetches data from Disease Ontology API for a specific disease 
        const response = await fetch('https://www.disease-ontology.org/api/metadata/C0011843');
        
        
        if (!response.ok) {
            throw new Error("Failed to fetch data from Disease Ontology API");
        }
        
        const data = await response.json();
        
        console.log(data);

        // Processes the API data 
        const processedData = [{
            disease: data.name,  
            cases: Math.floor(Math.random() * 100)  
        }];
        
        createBarGraph(processedData);
    } catch (error) {
        console.error("Error fetching Disease Ontology data:", error);
    }
});

// creates bar graph (uses D3.js)
function createBarGraph(diseaseData) {
    // Sets up the width and height of the SVG container
    const width = 500, height = 300;
    const svg = d3.select("#graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    // x and y scales for the graph
    const x = d3.scaleBand()
        .domain(diseaseData.map(d => d.disease))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(diseaseData, d => d.cases)])
        .nice()
        .range([height, 0]);

    // bars
    svg.selectAll(".bar")
        .data(diseaseData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.disease))
        .attr("y", d => y(d.cases))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.cases))
        .attr("fill", "steelblue");

    // Adds x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Adds y-axis
    svg.append("g")
        .call(d3.axisLeft(y));
}