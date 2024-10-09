
//main buttons
document.addEventListener('DOMContentLoaded', function() {
    
    setupNavigationButtons();
    animateTitleText();
    setupReadMoreButtons();

    const blogPosts = d3.selectAll('.blog-post');

    //integration of the vegan vegetarian data and the Geojson data
    d3.json("jsonfile/veganvegetariandata.json").then(function(data) {
        d3.json("jsonfile/Countries.json").then(function(geoData) {
            createMap(geoData, data); // data used for createMap function
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

    const path = d3.geoPath().projection(projection);

    // GeoJSON data for world map
    d3.json("jsonfile/veganvegetariandata.json").then(geoData => {
        svg.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "lightgray")
            .attr("stroke", "white")
            .on("mouseover", function(event, d) {
                const countryData = data.find(country => country.country === d.properties.name);
                if (countryData) {
                    d3.select(this)
                        .attr("fill", "blue");
                    const tooltip = svg.append("text")
                        .attr("x", event.pageX)
                        .attr("y", event.pageY)
                        .attr("text-anchor", "middle")
                        .attr("font-size", "16px")
                        .attr("fill", "black")
                        .text(`${d.properties.name}: ${countryData.vegans_percentage}% vegans, ${countryData.vegetarians_percentage}% vegetarians`);
                }
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("fill", "lightgray");
                svg.selectAll("text").remove();
            });
    });
}