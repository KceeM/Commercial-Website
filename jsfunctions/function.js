
document.addEventListener('DOMContentLoaded', function() {
    
    setupNavigationButtons();

})
    
function setupNavigationButtons() {
    const buttons = [
        { id: 'homeBtn', url: 'index.html' },
        { id: 'blogBtn', url: 'blog.html' },
        { id: 'portfolioBtn', url: 'portfolio.html' },
        { id: 'documentBtn', url: 'document.html' },
        { id: 'profileBtn', url: 'profile.html' },
        { id: 'essayBtn', url: 'essay.html' },
        { id: 'recentBlogsBtn', url: 'blog.html' }
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

    d3.select("#intro-section")
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