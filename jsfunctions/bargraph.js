document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetches chronic disease data from CDC
        const response = await fetch('https://chronicdata.cdc.gov/resource/u93h-quup.json?$limit=10&category=Diabetes');
        
        if (!response.ok) {
            throw new Error("Failed to fetch data from CDC Chronic Disease Indicators API");
        }

        const data = await response.json();
        console.log(data);

        // Process the API data 
        const processedData = data.map(item => ({
            state: item.locationdesc,
            prevalence: parseFloat(item.data_value) || 0 
        }));

        // Call 
        createBarGraph(processedData);
    } catch (error) {
        console.error("Error fetching CDC data:", error);
    }
});

// Creates a bar graph with D3.js
function createBarGraph(diseaseData) {
    const width = 500, height = 300;
    const svg = d3.select(".graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    // x and y scales for the graph
    const x = d3.scaleBand()
        .domain(diseaseData.map(d => d.state))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(diseaseData, d => d.prevalence)])
        .nice()
        .range([height, 0]);

    // Create bars
    svg.selectAll(".bar")
        .data(diseaseData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.state))
        .attr("y", d => y(d.prevalence))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.prevalence))
        .attr("fill", "steelblue");

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y));
}