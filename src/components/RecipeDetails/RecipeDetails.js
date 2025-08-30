import React, { useState } from 'react';
import './RecipeDetails.css';
import { calculateNutritionForServings } from '../../utils/nutritionCalculator';

const RecipeDetails = ({ 
  recipe, 
  onBack, 
  isFavorite, 
  onToggleFavorite, 
  rating, 
  onRate 
}) => {
  const [servings, setServings] = useState(recipe.servings || 4);
  const [activeTab, setActiveTab] = useState('instructions');
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const adjustedNutrition = calculateNutritionForServings(
    recipe.nutrition, 
    recipe.servings || 4, 
    servings
  );

  const adjustedIngredients = recipe.ingredients.map(ingredient => ({
    ...ingredient,
    amount: ((ingredient.amount || 1) * servings / (recipe.servings || 4)).toFixed(1)
  }));

  const handleStarClick = (starRating) => {
    onRate(starRating);
  };

  const handleStepComplete = (stepIndex) => {
    const newCompletedSteps = new Set(completedSteps);
    if (newCompletedSteps.has(stepIndex)) {
      newCompletedSteps.delete(stepIndex);
    } else {
      newCompletedSteps.add(stepIndex);
    }
    setCompletedSteps(newCompletedSteps);
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
        onClick={() => handleStarClick(index + 1)}
        aria-label={`Rate ${index + 1} star${index + 1 > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="recipe-details">
      <div className="recipe-details-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Recipes
        </button>
        <div className="header-actions">
          <button
            onClick={onToggleFavorite}
            className={`favorite-btn ${isFavorite ? 'favorite' : ''}`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            ♥ {isFavorite ? 'Favorited' : 'Save Recipe'}
          </button>
          <button 
            onClick={() => window.print()} 
            className="print-btn"
            title="Print recipe"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      <div className="recipe-hero">
        <div className="recipe-hero-image">
          <img 
            src={recipe.image || 'https://via.placeholder.com/600x400?text=Recipe+Image'} 
            alt={recipe.name} 
          />
          {recipe.matchPercentage && (
            <div className="match-overlay">
              <span className="match-percentage">{recipe.matchPercentage}% Match</span>
            </div>
          )}
        </div>
        
        <div className="recipe-hero-content">
          <div className="recipe-title-section">
            <h1>{recipe.name}</h1>
            <span className="recipe-cuisine-tag">{recipe.cuisine}</span>
          </div>
          
          <p className="recipe-description">{recipe.description}</p>
          
          <div className="recipe-meta-grid">
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <div>
                <span className="meta-label">Cook Time</span>
                <span className="meta-value">{recipe.cookingTime} min</span>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📊</span>
              <div>
                <span className="meta-label">Difficulty</span>
                <span className="meta-value">{recipe.difficulty}</span>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🍽️</span>
              <div>
                <span className="meta-label">Servings</span>
                <div className="serving-controls">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="serving-btn"
                    disabled={servings <= 1}
                  >
                    −
                  </button>
                  <span className="serving-count">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="serving-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🔥</span>
              <div>
                <span className="meta-label">Calories</span>
                <span className="meta-value">{Math.round(adjustedNutrition.calories / servings)}/serving</span>
              </div>
            </div>
          </div>

          <div className="recipe-rating-section">
            <span className="rating-label">Your Rating:</span>
            <div className="stars">
              {renderStars()}
            </div>
            <span className="rating-text">({rating}/5 stars)</span>
          </div>

          {recipe.dietary && recipe.dietary.length > 0 && (
            <div className="dietary-tags">
              {recipe.dietary.map(diet => (
                <span key={diet} className="dietary-tag">{diet}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-tabs">
          <button
            className={`tab ${activeTab === 'instructions' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructions')}
          >
            <span className="tab-icon">📝</span>
            Instructions
          </button>
          <button
            className={`tab ${activeTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingredients')}
          >
            <span className="tab-icon">🛒</span>
            Ingredients
          </button>
          <button
            className={`tab ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => setActiveTab('nutrition')}
          >
            <span className="tab-icon">📊</span>
            Nutrition
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'instructions' && (
            <div className="instructions-section">
              <div className="instructions-header">
                <h2>Cooking Instructions</h2>
                <div className="progress-indicator">
                  {completedSteps.size}/{recipe.instructions.length} steps completed
                </div>
              </div>
              
              <div className="instructions-list">
                {recipe.instructions.map((instruction, index) => (
                  <div 
                    key={index} 
                    className={`instruction-step ${completedSteps.has(index) ? 'completed' : ''}`}
                  >
                    <div className="step-header">
                      <button
                        className="step-checkbox"
                        onClick={() => handleStepComplete(index)}
                        aria-label={`Mark step ${index + 1} as ${completedSteps.has(index) ? 'incomplete' : 'complete'}`}
                      >
                        {completedSteps.has(index) ? '✓' : ''}
                      </button>
                      <span className="step-number">Step {index + 1}</span>
                    </div>
                    <p className="step-text">{instruction}</p>
                  </div>
                ))}
              </div>
              
              {recipe.tips && recipe.tips.length > 0 && (
                <div className="cooking-tips">
                  <h3>💡 Pro Tips</h3>
                  <ul>
                    {recipe.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="ingredients-section">
              <div className="ingredients-header">
                <h2>Ingredients (for {servings} serving{servings !== 1 ? 's' : ''})</h2>
                <button className="shopping-list-btn">
                  🛒 Create Shopping List
                </button>
              </div>
              
              <div className="ingredients-list">
                {adjustedIngredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    <div className="ingredient-checkbox">
                      <input type="checkbox" id={`ingredient-${index}`} />
                      <label htmlFor={`ingredient-${index}`}></label>
                    </div>
                    <div className="ingredient-info">
                      <span className="ingredient-amount">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                      <span className="ingredient-name">{ingredient.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {recipe.substitutions && recipe.substitutions.length > 0 && (
                <div className="substitutions">
                  <h3>🔄 Ingredient Substitutions</h3>
                  <div className="substitutions-list">
                    {recipe.substitutions.map((sub, index) => (
                      <div key={index} className="substitution-item">
                        <strong>{sub.ingredient}:</strong> {sub.substitute}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="nutrition-section">
              <div className="nutrition-header">
                <h2>Nutrition Information</h2>
                <p className="nutrition-subtitle">Per serving (based on {servings} servings)</p>
              </div>
              
              <div className="nutrition-grid">
                <div className="nutrition-card featured">
                  <span className="nutrition-label">Calories</span>
                  <span className="nutrition-value large">{Math.round(adjustedNutrition.calories / servings)}</span>
                  <span className="nutrition-unit">kcal</span>
                </div>
                
                <div className="nutrition-card">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">{Math.round(adjustedNutrition.protein / servings)}</span>
                  <span className="nutrition-unit">g</span>
                </div>
                
                <div className="nutrition-card">
                  <span className="nutrition-label">Carbohydrates</span>
                  <span className="nutrition-value">{Math.round(adjustedNutrition.carbs / servings)}</span>
                  <span className="nutrition-unit">g</span>
                </div>
                
                <div className="nutrition-card">
                  <span className="nutrition-label">Fat</span>
                  <span className="nutrition-value">{Math.round(adjustedNutrition.fat / servings)}</span>
                  <span className="nutrition-unit">g</span>
                </div>
                
                <div className="nutrition-card">
                  <span className="nutrition-label">Fiber</span>
                  <span className="nutrition-value">{Math.round(adjustedNutrition.fiber / servings)}</span>
                  <span className="nutrition-unit">g</span>
                </div>
                
                <div className="nutrition-card">
                  <span className="nutrition-label">Sugar</span>
                  <span className="nutrition-value">{Math.round(adjustedNutrition.sugar / servings)}</span>
                  <span className="nutrition-unit">g</span>
                </div>
              </div>
              
              <div className="nutrition-notes">
                <p><strong>Note:</strong> Nutritional values are approximate and may vary based on specific ingredients and preparation methods.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
