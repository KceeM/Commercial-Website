// The text to animate
const typewriterText = "Kaycee Chantelle, and I am passionate about living a plant-based lifestyle. Here’s why...";

//animates the text
function typeWriterEffect(text, elementId, speed) {
    const d3Element = d3.select(elementId);
    let index = 0;
    
    function type() {
        if (index < text.length) {
            d3Element.text(d3Element.text() + text.charAt(index));
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// function on window load or after the DOM is ready
window.onload = function() {
    typeWriterEffect(typewriterText, "#typewriter", 100); // speed (100ms)
};




