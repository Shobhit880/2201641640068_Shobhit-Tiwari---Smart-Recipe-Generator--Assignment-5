import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  IngredientInput, 
  FilterPanel, 
  RecipeList, 
  RecipeDetails, 
  LoadingSpinner 
} from './components';
import { useRecipeSearch } from './hooks/useRecipeSearch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useRecipeContext as _useRecipeContext } from './context/RecipeContext';
import { useUserPreferences } from './context/UserPreferencesContext';

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [filters, setFilters] = useState({
    dietary: '',
    difficulty: '',
    maxCookingTime: '',
    cuisine: ''
  });

  const { recipes, loading, error } = useRecipeSearch(ingredients, filters);
  const [favorites, setFavorites] = useLocalStorage('recipe-favorites', []);
  const [ratings, setRatings] = useLocalStorage('recipe-ratings', {});
  const { updatePreferences } = useUserPreferences();

  useEffect(() => {
    // Update user preferences based on interactions
    updatePreferences({ ingredients, filters, favorites, ratings });
  }, [ingredients, filters, favorites, ratings, updatePreferences]);

  const handleIngredientsChange = (newIngredients) => {
    setIngredients(newIngredients);
    setSelectedRecipe(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedRecipe(null);
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToList = () => {
    setSelectedRecipe(null);
  };

  const handleToggleFavorite = (recipeId) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleRating = (recipeId, rating) => {
    setRatings(prev => ({ ...prev, [recipeId]: rating }));
  };

  if (error) {
    return (
      <div className="app-error">
        <div className="container">
          <div className="error-content">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1>🍳 Smart Recipe Generator</h1>
            <p>Discover amazing recipes from your ingredients using AI</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {selectedRecipe ? (
            <RecipeDetails
              recipe={selectedRecipe}
              onBack={handleBackToList}
              isFavorite={favorites.includes(selectedRecipe.id)}
              onToggleFavorite={() => handleToggleFavorite(selectedRecipe.id)}
              rating={ratings[selectedRecipe.id] || 0}
              onRate={(rating) => handleRating(selectedRecipe.id, rating)}
            />
          ) : (
            <>
              <section className="input-section">
                <IngredientInput
                  ingredients={ingredients}
                  onIngredientsChange={handleIngredientsChange}
                />
              </section>

              <section className="filter-section">
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </section>

              <section className="results-section">
                {loading ? (
                  <LoadingSpinner message="Finding perfect recipes for you..." />
                ) : (
                  <RecipeList
                    recipes={recipes}
                    onRecipeSelect={handleRecipeSelect}
                    favorites={favorites}
                    ratings={ratings}
                    onToggleFavorite={handleToggleFavorite}
                    onRate={handleRating}
                    searchQuery={ingredients.join(', ')}
                  />
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2025 Smart Recipe Generator. Made with ❤️ for food lovers.</p>
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#privacy">Privacy</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
