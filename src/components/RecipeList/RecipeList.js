import React, { useState, useMemo } from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import './RecipeList.css';

const RecipeList = ({ 
  recipes, 
  onRecipeSelect, 
  favorites, 
  ratings, 
  onToggleFavorite, 
  onRate,
  searchQuery = ''
}) => {
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = [...recipes];

    // Filter favorites if needed
    if (showFavoritesOnly) {
      filtered = filtered.filter(recipe => favorites.includes(recipe.id));
    }

    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (ratings[b.id] || 0) - (ratings[a.id] || 0);
        case 'cookingTime':
          return a.cookingTime - b.cookingTime;
        case 'calories':
          return a.nutrition.calories - b.nutrition.calories;
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2);
        case 'relevance':
        default:
          return (b.matchPercentage || 0) - (a.matchPercentage || 0);
      }
    });

    return filtered;
  }, [recipes, favorites, ratings, sortBy, showFavoritesOnly]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleFavoritesToggle = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  if (recipes.length === 0) {
    return (
      <div className="recipe-list-empty">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No recipes found</h3>
          <p>
            {searchQuery 
              ? `No recipes match your ingredients: "${searchQuery}". Try different ingredients or adjust your filters.`
              : 'Try adding some ingredients or adjusting your filters to find recipes.'
            }
          </p>
          <div className="empty-suggestions">
            <p><strong>Suggestions:</strong></p>
            <ul>
              <li>Add common ingredients like chicken, rice, or vegetables</li>
              <li>Try broader dietary preferences</li>
              <li>Increase the maximum cooking time</li>
              <li>Upload a photo of your ingredients</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (showFavoritesOnly && filteredAndSortedRecipes.length === 0) {
    return (
      <div className="recipe-list-empty">
        <div className="empty-state">
          <div className="empty-icon">💔</div>
          <h3>No favorite recipes yet</h3>
          <p>Start exploring recipes and add your favorites by clicking the heart icon!</p>
          <button 
            onClick={() => setShowFavoritesOnly(false)}
            className="show-all-btn"
          >
            Show All Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <div className="recipe-list-header">
        <div className="results-info">
          <h2>
            {showFavoritesOnly 
              ? `Your Favorites (${filteredAndSortedRecipes.length})`
              : `Found ${filteredAndSortedRecipes.length} recipe${filteredAndSortedRecipes.length !== 1 ? 's' : ''}`
            }
          </h2>
          {searchQuery && !showFavoritesOnly && (
            <p className="search-query">Matching ingredients: <em>"{searchQuery}"</em></p>
          )}
        </div>
        
        <div className="list-controls">
          <div className="control-group">
            <label htmlFor="sort-select" className="control-label">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="cookingTime">Cooking Time</option>
              <option value="calories">Calories</option>
              <option value="difficulty">Difficulty</option>
              <option value="alphabetical">Name A-Z</option>
            </select>
          </div>
          
          <div className="control-group">
            <button
              onClick={handleFavoritesToggle}
              className={`favorites-filter-btn ${showFavoritesOnly ? 'active' : ''}`}
              title={showFavoritesOnly ? 'Show all recipes' : 'Show favorites only'}
            >
              ♥ {showFavoritesOnly ? 'All' : 'Favorites'}
            </button>
          </div>
          
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              title="Grid view"
              aria-label="Grid view"
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              title="List view"
              aria-label="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
      
      <div className={`recipes-container ${viewMode}`}>
        {filteredAndSortedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onSelect={onRecipeSelect}
            isFavorite={favorites.includes(recipe.id)}
            onToggleFavorite={onToggleFavorite}
            rating={ratings[recipe.id] || 0}
            onRate={onRate}
          />
        ))}
      </div>

      {filteredAndSortedRecipes.length > 10 && (
        <div className="load-more-section">
          <p className="load-more-info">
            Showing {Math.min(filteredAndSortedRecipes.length, 20)} of {filteredAndSortedRecipes.length} recipes
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;
