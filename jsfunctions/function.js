
//main buttons
document.addEventListener('DOMContentLoaded', function() {
    
    setupNavigationButtons();
    animateTitleText();
    setupReadMoreButtons();
    

    const blogPosts = d3.selectAll('.blog-post');

    //integration of the vegan vegetarian data and the svg data
    d3.xml("map.svg").then(function(data) {
        
        const svgElement = d3.select("#map-container").node().appendChild(data.documentElement);
    
        // Set the SVG's width and height
        svgElement.setAttribute("width", "100%"); 
        svgElement.setAttribute("height", "auto");
    
        setupSVGInteractions(); // functions for calling interactions after map is loaded

        //adding the veganveg data to the map
        d3.json("../jsonfile/veganvegetariandata.json").then(function(veganData) {
            updateMapWithData(veganData);
        });
    });

    //slide down - blogs
    blogPosts.style("opacity", 0) 
              .style("transform", "translateY(20px)"); // Move down a bit

    //staggering method
    blogPosts.each(function(d, i) {
        d3.select(this)
            .transition()
            .delay(i * 200)
            .duration(1000) // Duration = 1 sec
            .style("opacity", 1) // Fade in
            .style("transform", "translateY(0)"); //original pos
    });

    

})

//function for navigation buttons    
function setupNavigationButtons() {
    const buttons = [
        { id: 'homeBtn', url: 'index.html' },
        { id: 'blogsBtn', url: 'blogposts.html' },
        { id: 'recipesBtn', url: 'recipes.html' },
        { id: 'dataBtn', url: 'data.html' },
        { id: 'profileBtn', url: 'profile.html' },
        { id: 'designBtn', url: 'design.html' },
        { id: 'theorysBtn', url: 'theory.html' },
        
    ];
    
    buttons.forEach(button => {
        const btnElement = document.getElementById(button.id);
        if (btnElement) {
            btnElement.addEventListener('click', function() {
                window.location.href = button.url;
            });
        }
    });
}

function setupReadMoreButtons() {
    const toggleButtons = document.querySelectorAll('.toggleButton');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const extraContent = this.nextElementSibling;
            if (extraContent.classList.contains('extra-content')) {
                if (extraContent.style.display === 'none' || extraContent.style.display === '') {
                    extraContent.style.display = 'block';
                    this.textContent = 'Read Less';
                } else {
                    extraContent.style.display = 'none';
                    this.textContent = 'Read More';
                }
            }
        });
    });
}
//D3.js function to animate the title text
function animateTitleText() {
    d3.select("#title-text")
        .style("opacity", 0)
        .transition()
        .duration(2000)
        .style("opacity", 1)
        .style("transform", "scale(1.1)")
        .transition()
        .duration(500)
        .style("transform", "scale(1)");

    d3.select("#beginning-section")
        .on("mouseover", function() {
            d3.select("#title-text")
                .transition()
                .duration(300)
                .style("transform", "scale(1.05)");
        })
        .on("mouseout", function() {
            d3.select("#title-text")
                .transition()
                .duration(300)
                .style("transform", "scale(1)");
        });
}

// Creating map visualization
function createMap(data) {
    const width = 800;
    const height = 600;

    const svg = d3.select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Scale for positioning circles
    const projection = d3.geoMercator()
        .scale(150)
        .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);p

     //Calling function to update map
     updateMapWithData(data);

}

// Function to update the map with vegan/vegetarian data
function updateMapWithData(data) {
    const tooltip = d3.select("body").append("div") 
        .attr("class", "tooltip") 
        .style("opacity", 0); 

    data.forEach(function(d) {
        // Select country by ID
        const countryElement = d3.select(`#${d.country.replace(/\s+/g, '')}`);

        // Check country
        if (countryElement.size() > 0) {
            // Set the initial fill color based on the vegan percentage
            const fillColor = d.vegans_percentage > 0 ? "lightgreen" : "lightgrey"; 
            countryElement.attr("fill", fillColor);

            // mouseover functionality for countries with data
            if (d.vegans_percentage > 0 || d.vegetarians_percentage > 0) {
                countryElement
                    .on("mouseover", function(event) {
                        tooltip.transition().duration(200).style("opacity", .9);
                        tooltip.html(`${d.country}<br>Vegans: ${d.vegans_percentage}%<br>Vegetarians: ${d.vegetarians_percentage}%`)
                            .style("left", (event.pageX + 5) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mousemove", function(event) {
                        tooltip.style("left", (event.pageX + 5) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function() {
                        tooltip.transition().duration(500).style("opacity", 0);
                    });
            } else {
                // Countries without data remain grey and non-interactive
                countryElement
                    .attr("fill", "lightgray")
                    .style("pointer-events", "none"); 
            }
        }
    });
}

function setupSVGInteractions() {
    
    d3.selectAll("#ne_10m_admin_0_countries path")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "blue"); // Change color on hover
        })
}           