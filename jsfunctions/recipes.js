document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'ef0323f5045049b28c111ce2a02c9687'; // my Spoonacular API key

    // Fetching 10 vegan recipes
    fetch(`https://api.spoonacular.com/recipes/complexSearch?diet=vegan&number=36&addRecipeInformation=true&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => displayRecipes(data.results))
        .catch(error => console.error("Error loading recipes:", error));

    function displayRecipes(recipes) {
        const recipesContainer = document.getElementById('recipes-container');
        recipes.forEach(recipe => {
            // Creates recipe card
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');

            // Recipe image
            const img = document.createElement('img');
            img.src = recipe.image;
            img.alt = recipe.title;
            recipeCard.appendChild(img);

            // Recipe title
            const title = document.createElement('h2');
            title.textContent = recipe.title;
            recipeCard.appendChild(title);

            // View Recipe Button
            const viewButton = document.createElement('button');
            viewButton.textContent = 'View Recipe';
            viewButton.addEventListener('click', () => {
                window.open(`https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}`, '_blank');
            });
            recipeCard.appendChild(viewButton);

            
            recipesContainer.appendChild(recipeCard);
        });
    }
});