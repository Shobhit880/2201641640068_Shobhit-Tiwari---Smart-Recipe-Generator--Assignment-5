import React from 'react';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onSelect, isFavorite, onToggleFavorite, rating, onRate }) => {
  const handleStarClick = (e, starRating) => {
    e.stopPropagation();
    onRate(recipe.id, starRating);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(recipe.id);
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
        onClick={(e) => handleStarClick(e, index + 1)}
        role="button"
        tabIndex={0}
        aria-label={`Rate ${index + 1} star${index + 1 > 1 ? 's' : ''}`}
      >
        ★
      </span>
    ));
  };

  const getMatchPercentage = () => {
    return recipe.matchPercentage || 0;
  };

  return (
    <article className="recipe-card" onClick={() => onSelect(recipe)}>
      <div className="recipe-image">
        <img 
          src={recipe.image || 'https://via.placeholder.com/400x300?text=Recipe+Image'} 
          alt={recipe.name}
          loading="lazy"
        />
        <div className="recipe-badges">
          {getMatchPercentage() > 0 && (
            <span className="match-badge">{getMatchPercentage()}% match</span>
          )}
          {recipe.dietary && recipe.dietary.length > 0 && (
            <span className="dietary-badge">{recipe.dietary[0]}</span>
          )}
        </div>
        <button
          className={`favorite-btn-overlay ${isFavorite ? 'favorite' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ♥
        </button>
      </div>
      
      <div className="recipe-content">
        <div className="recipe-header">
          <h3 className="recipe-title">{recipe.name}</h3>
          <span className="recipe-cuisine">{recipe.cuisine}</span>
        </div>
        
        <div className="recipe-meta">
          <span className="meta-item">
            <span className="meta-icon">⏱️</span>
            {recipe.cookingTime} min
          </span>
          <span className="meta-item">
            <span className="meta-icon">📊</span>
            {recipe.difficulty}
          </span>
          <span className="meta-item">
            <span className="meta-icon">🍽️</span>
            {recipe.servings || 4} servings
          </span>
        </div>
        
        <div className="recipe-nutrition">
          <span className="nutrition-item">
            <strong>{recipe.nutrition.calories}</strong> cal
          </span>
          <span className="nutrition-item">
            <strong>{recipe.nutrition.protein}g</strong> protein
          </span>
          <span className="nutrition-item">
            <strong>{recipe.nutrition.carbs}g</strong> carbs
          </span>
        </div>
        
        <div className="recipe-rating" onClick={(e) => e.stopPropagation()}>
          <div className="stars">
            {renderStars()}
          </div>
          <span className="rating-text">({rating}/5)</span>
        </div>
        
        <p className="recipe-description">{recipe.description}</p>
        
        <div className="recipe-ingredients-preview">
          <small>
            <strong>Main ingredients:</strong> {recipe.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}
            {recipe.ingredients.length > 3 && `... +${recipe.ingredients.length - 3} more`}
          </small>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
