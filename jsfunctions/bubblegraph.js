let allRecipes = []; // Global declaration

document.addEventListener('DOMContentLoaded', async function() {
    const apiKey = 'e42e2c2ee6f645438c5f3e68a37d31f3';  

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
        allRecipes = [...vegetarianRecipes, ...selectedMeatRecipes];

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
    d3.select(".bubble-chart-container").select("svg").remove();
    const width = 900, height = 600;

    const svg = d3.select(".bubble-chart-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Tooltip functionality
    const tooltip = d3.select("#tooltip1");

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([50, width - 50]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthScore)])
        .range([height - 50, 50]);

    const size = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.healthScore)])
        .range([10, 50]);

    // Get filter states
    const vegetarianVisible = document.getElementById('vegetarianFilter').checked;
    const meatVisible = document.getElementById('meatFilter').checked;

    svg.selectAll("circle")
    .data(data)
    .join(
        enter => enter.append("circle")
            .attr("cx", d => x(d.price))
            .attr("cy", d => y(d.healthScore))
            .attr("r", d => size(d.healthScore))
            .attr("fill", d => {
                if (!vegetarianVisible && d.type === 'Vegetarian') {
                    return "transparent"; // Hide vegetarian items if not visible
                } else if (!meatVisible && d.type === 'Meat') {
                    return "transparent"; // Hide meat items if not visible
                }
                return d.type === 'Vegetarian' ? "#69b3a2" : "#FF6347";
            })
            .attr("opacity", d => {
                if (!vegetarianVisible && d.type === 'Vegetarian') {
                    return 0.2; // Less opacity for hidden vegetarian items
                } else if (!meatVisible && d.type === 'Meat') {
                    return 0.2; // Less opacity for hidden meat items
                }
                return 1; // Full opacity for visible items
            })
            .attr("stroke", "#404040")
            .attr("stroke-width", 1.5)
            .on("mouseover", function(event, d) {
                d3.select(this)
                   .transition()
                   .duration(200)
                   .attr("r", size(d.healthScore) * 1.3)  // Increase size
                   .attr("fill", "yellow");  // Highlight color change

                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`<strong>${d.title}</strong><br>Price: $${(d.price / 100).toFixed(2)}<br>Health Score: ${d.healthScore}<br>Type: ${d.type === 'Vegetarian' ? 'Vegetarian' : 'Meat'}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", d => size(d.healthScore))  // Revert size
                    .attr("fill", d => d.type === 'Vegetarian' ? "#69b3a2" : "#FF6347");  // Revert color
                    
                tooltip.transition().duration(500).style("opacity", 0);
            }),
        update => update
            .attr("fill", d => {
                if (!vegetarianVisible && d.type === 'Vegetarian') {
                    return "transparent";
                } else if (!meatVisible && d.type === 'Meat') {
                    return "transparent";
                }
                return d.type === 'Vegetarian' ? "#69b3a2" : "#FF6347";
            })
            .attr("opacity", d => {
                if (!vegetarianVisible && d.type === 'Vegetarian') {
                    return 0.2;
                } else if (!meatVisible && d.type === 'Meat') {
                    return 0.2;
                }
                return 1;
            }),
        exit => exit.remove()
    );

    // x-axis
    if (svg.selectAll(".x-axis").empty()) {
        svg.append("g")
            .attr("transform", `translate(0,${height - 50})`)
            .call(d3.axisBottom(x).ticks(5))
            .append("text")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("fill", "#000")
            .text("Price per Serving")
            .classed("x-axis", true);
    }

    // y-axis
    if (svg.selectAll(".y-axis").empty()) {
        svg.append("g")
            .attr("transform", "translate(50, 0)")
            .call(d3.axisLeft(y).ticks(5))
            .append("text")
            .attr("x", -height / 2)
            .attr("y", -40)
            .attr("transform", "rotate(-90)")
            .attr("fill", "#000")
            .text("Health Score")
            .classed("y-axis", true);
    }
}

document.querySelectorAll('#filter-options input').forEach(input => {
    input.addEventListener('change', () => {
        const selectedTypes = Array.from(document.querySelectorAll('#filter-options input:checked')).map(el => el.id.replace('Filter', ''));
        const filteredData = allRecipes.filter(recipe => selectedTypes.includes(recipe.type));
        updateBubbleChart(filteredData);  
    });
});


//Interaction elements that are added to my graph
document.getElementById('healthScoreRange').addEventListener('input', event => {
    const healthScoreThreshold = event.target.value;
    document.getElementById('healthScoreValue').innerText = healthScoreThreshold;
    const filteredData = allRecipes.filter(recipe => recipe.healthScore <= healthScoreThreshold);
    updateBubbleChart(filteredData);
});

document.getElementById('priceRange').addEventListener('input', event => {
    const priceThreshold = event.target.value;
    document.getElementById('priceValue').innerText = priceThreshold;
    const filteredData = allRecipes.filter(recipe => recipe.price <= priceThreshold);
    updateBubbleChart(filteredData);
});

document.getElementById('ingredientSearch').addEventListener('input', event => {
    const query = event.target.value.toLowerCase();
    const filteredData = allRecipes.filter(recipe => recipe.title.toLowerCase().includes(query));
    updateBubbleChart(filteredData);
});

document.getElementById('add-comment').addEventListener('click', () => {
    const comment = document.getElementById('comment-input').value;
    if (comment) {
        const listItem = document.createElement('li');
        listItem.textContent = comment;
        document.getElementById('comments-list').appendChild(listItem);
        document.getElementById('comment-input').value = '';
    }
});

document.querySelectorAll('#vegetarianFilter, #meatFilter').forEach(item => {
    item.addEventListener('input', () => {
        const vegetarianVisible = document.getElementById('vegetarianFilter').checked;
        const meatVisible = document.getElementById('meatFilter').checked;

        // Filtering data 
        const filteredData = allRecipes.filter(recipe => {
            if (!vegetarianVisible && recipe.type === 'Vegetarian') return false;
            if (!meatVisible && recipe.type === 'Meat') return false;
            return true;
        });

        
        createBubbleChart(filteredData);
    });
});

