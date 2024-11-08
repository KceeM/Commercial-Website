document.addEventListener('DOMContentLoaded', async function() {
    const apiKey = 'f5373f6c07d5410dac1a50e92c2aa8a7';  

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?diet=vegetarian&number=10&addRecipeInformation=true&apiKey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch data from Spoonacular API");
        }

        const data = await response.json();
        console.log(data.results);
        
        const recipes = data.results.map(recipe => {
            const protein = recipe.nutrition && recipe.nutrition.nutrients
                 ? recipe.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 0 
                 : 0;

            
            return{  
                title: recipe.title,
                price: recipe.pricePerServing,
                protein: protein,
                healthScore: recipe.healthScore

            }
            
        });

        if (recipes.length > 0) {
            createBubbleChart(recipes);
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

    // tooltip
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
        .domain([0, d3.max(data, d => d.protein)])
        .range([height - 50, 50]);

    const size = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.healthScore)])
        .range([10, 50]);

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.price))
        .attr("cy", d => y(d.protein))
        .attr("r", d => size(d.healthScore))
        .attr("fill", "#69b3a2")
        .attr("stroke", "#404040")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`<strong>${d.title}</strong><br>Price: $${(d.price / 100).toFixed(2)}<br>Protein: ${d.protein}<br>Health Score: ${d.healthScore}`)
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
        .text("Protein (g)");
}