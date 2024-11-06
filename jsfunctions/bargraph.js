document.addEventListener('DOMContentLoaded', async function() {
    try {
        const apiKey = 'b2cb30794d014fe595b6f84ff7a1f97a'; 
        const query = "tofu, avocado, lentils, beans, kale"; 
        const response = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${query}&apiKey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch data from Spoonacular API");
        }

        const data = await response.json();
        console.log("Raw data fetched:", data);  // Debugging

        // Map data to get food name and calories
        const filteredData = data.ingredients.map(item => ({
            name: item.name,
            calories: item.calories || 0
        }));

        console.log("Processed Data:", filteredData);

        if (filteredData.length > 0) {
            createBarGraph(filteredData);
        } else {
            console.error("No valid data found.");
        }
    } catch (error) {
        console.error("Error fetching Spoonacular data:", error);
    }
});

// Creates a bar graph with D3.js
function createBarGraph(foodData) {
    const width = 500, height = 300;
    const svg = d3.select(".graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    // x and y scales for the graph
    const x = d3.scaleBand()
        .domain(foodData.map(d => d.name))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(foodData, d => d.calories)])
        .nice()
        .range([height, 0]);

    // Create bars
    svg.selectAll(".bar")
        .data(foodData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.calories))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.calories))
        .attr("fill", "green");

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