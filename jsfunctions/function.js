
//main buttons
document.addEventListener('DOMContentLoaded', function() {
    
    setupNavigationButtons();
    animateTitleText();
    setupReadMoreButtons();
    setLinksToOpenInNewTab();
    
    const blogPosts = d3.selectAll('.blog-post');

    const apiKey = 'ef0323f5045049b28c111ce2a02c9687'; //API key from Spoonacular, attempted to use it for map & graphs

    fetch(`https://api.spoonacular.com/food/products?apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => createMap(data.products)) 
        .catch(error => console.error("Error loading product data:", error));

    //integration of the vegan vegetarian data and the svg data
    d3.xml("map.svg").then(function(data) {
        
        const mapContainer = d3.select("#map-container");
        const svgElement = mapContainer.node().appendChild(data.documentElement);
        const svg = d3.select(svgElement);
        
        svg.attr("viewBox", "0 0 800 600")
           .attr("width", "100%")
           .attr("height", "600");
        

        setupSVGInteractions();

        return d3.json("veganvegetariandata.json");
    }).then(function(veganData) {
        updateMapWithData(veganData); 
    }).catch(function(error) {
        console.error("Error loading SVG or JSON data:", error);
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

function setLinksToOpenInNewTab() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.setAttribute('target', '_blank');
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
function createMap(geoData) {
    const width = 800;
    const height = 600;

    const svg = d3.select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    
    const projection = d3.geoMercator()
        .scale(150)
        .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    
    const countries = svg.selectAll("path.country")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", d => d.properties.name.replace(/\s+/g, ''))
        .attr("fill", "black")
        .attr("stroke", "white");

    
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "blue")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("font-size", "12px");

    // hover functionality to display country names
    countries
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(d.properties.name)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition().duration(500).style("opacity", 0);
        });
}

function updateMapWithData(data) {
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    data.forEach(function(d) {
        const countryElement = d3.select(`#${d.country.replace(/\s+/g, '')}`);
        
        if (countryElement.size() > 0) {
            const fillColor = d.vegans_percentage > 0 ? "lightgreen" : "lightgrey";
            countryElement.attr("fill", fillColor)
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
        }
    });
}

function setupSVGInteractions() {
    d3.selectAll("#ne_10m_admin_0_countries path")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "blue"); // Change color on hover
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("fill", "black"); // Revert back to original color on mouseout
        });
}