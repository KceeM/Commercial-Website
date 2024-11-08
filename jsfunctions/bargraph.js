document.addEventListener('DOMContentLoaded', async function() {
    try {
        const apiKey = 'e383cda1a82a42d1a4eb3acafa246466';  
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?diet=vegetarian&number=5&addRecipeInformation=true&apiKey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch data from Spoonacular API");
        }

        const data = await response.json();
        console.log("Raw data fetched:", data);  // Debugging

        // Process data for bar graph
        const mealData = data.results
            .filter(meal => meal.pricePerServing)
            .map(meal => ({
                name: meal.title,
                price: meal.pricePerServing / 100  
            }));

        console.log("Processed Data:", mealData);

        if (mealData.length > 0) {
            createBarGraph(mealData);
        } else {
            console.error("No valid data found.");
        }
    } catch (error) {
        console.error("Error fetching Spoonacular data:", error);
    }
});

// this is the function to create the bar graph using D3.js
function createBarGraph(mealData) {
    const width = 500, height = 300, margin = { top: 40, right: 20, bottom: 70, left: 70 };

    // SVG with margin for axes and labels
    const svg = d3.select(".graph-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // x and y axes scales
    const x = d3.scaleBand()
        .domain(mealData.map(d => d.name))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(mealData, d => d.price)])
        .nice()
        .range([height, 0]);

    // Tooltip
    const tooltip = d3.select("#tooltip2");
       

    // Creates the bars
    svg.selectAll(".bar")
        .data(mealData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.price))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.price))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            tooltip.html(`Meal: ${d.name}<br>Price: $${d.price.toFixed(2)}`)
                .style("visibility", "visible");
        })
        .on("mousemove", function(event) {
            tooltip.style("top", `${event.pageY - 10}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    // x-axis 
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // y-axis
    svg.append("g")
        .call(d3.axisLeft(y));


    // y-axis text
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("transform", "rotate(-90)")
        .text("Price ($)");
}

