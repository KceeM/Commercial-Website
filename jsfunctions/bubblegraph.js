document.addEventListener('DOMContentLoaded', async function() {
    const apiKey = 'bdbb0bfd273c475dba46e27d6673fdfd';  

    try {
        // Fetching vegetarian data
        const vegetarianResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?diet=vegetarian&number=15&addRecipeInformation=true&apiKey=${apiKey}`);
        
        
        if (!vegetarianResponse.ok) {
            throw new Error("Failed to fetch vegetarian data from Spoonacular API");
        }

        const vegetarianData = await vegetarianResponse.json();
        console.log(vegetarianData.results);

        // Fetching meat data
        const meatResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?includeIngredients=beef&number=15&addRecipeInformation=true&apiKey=${apiKey}`);
        
        if (!meatResponse.ok) {
            throw new Error("Failed to fetch meat data from Spoonacular API");
        }

        const meatData = await meatResponse.json();
        console.log(meatData.results);

        // Filtering out dessert recipes from vegetarian recipes
        const vegetarianRecipes = vegetarianData.results.filter(recipe => 
           !recipe.title.toLowerCase().includes("dessert") && 
           !recipe.title.toLowerCase().includes("muffins") && 
           !recipe.title.toLowerCase().includes("pie")
        ).map(recipe => ({
          title: recipe.title,
          price: recipe.pricePerServing,
          healthScore: recipe.healthScore || 0,
          type: 'Vegetarian'
}));

        const meatRecipes = meatData.results.map(recipe => ({
            title: recipe.title,
            price: recipe.pricePerServing,
            healthScore: recipe.healthScore || 0,
            type: 'Meat'
        }));

        // Randomly match meat recipes to the number of vegetarian recipes
        const selectedMeatRecipes = [];
        for (let i = 0; i < vegetarianRecipes.length; i++) {
            const randomIndex = Math.floor(Math.random() * meatRecipes.length);
            const meatRecipe = meatRecipes[randomIndex];
            selectedMeatRecipes.push({
                ...meatRecipe,
                type: 'Meat'    // Ensure 'type' is always set correctly
            });
        }

        

        // Merging the recipes (both vegetarian and meat)
        const allRecipes = [...vegetarianRecipes, ...selectedMeatRecipes];

        if (allRecipes.length > 0) {
            createBubbleChart(allRecipes);
        } else {
            console.error("No valid data found.");
        }
    } catch (error) {
        console.error("Error fetching Spoonacular data:", error);
    }
});


function createBubbleChart(data) {
    const width = 800, height = 500;

    const svg = d3.select(".bubble-chart-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Tooltip
    const tooltip = d3.select(".bubble-chart-container").append("section")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("box-shadow", "0px 0px 6px rgba(0, 0, 0, 0.3)");

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([50, width - 50]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthScore)])
        .range([height - 50, 50]);

    const size = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.healthScore)])
        .range([10, 50]);

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.price))
        .attr("cy", d => y(d.healthScore))
        .attr("r", d => size(d.healthScore))
        .attr("fill", d => d.type === 'Vegetarian' ? "#69b3a2" : "#FF6347") // Different colours for Vegetarian and Meat
        .attr("stroke", "#404040")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`<strong>${d.title}</strong><br>Price: $${(d.price / 100).toFixed(2)}<br>Health Score: ${d.healthScore}<br>Type: ${d.type === 'Vegetarian' ? 'Vegetarian' : 'Meat'}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    // x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(x).ticks(5))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "#000")
        .text("Price per Serving");

    // y-axis
    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(y).ticks(5))
        .append("text")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Health Score");
}