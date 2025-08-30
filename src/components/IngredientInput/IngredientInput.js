import React, { useState } from 'react';
import './IngredientInput.css';
import ImageUpload from './ImageUpload';
import { COMMON_INGREDIENTS } from '../../utils/constants';

const IngredientInput = ({ ingredients, onIngredientsChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 1) {
      const filteredSuggestions = COMMON_INGREDIENTS.filter(ingredient =>
        ingredient.toLowerCase().includes(value.toLowerCase()) &&
        !ingredients.includes(ingredient.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddIngredient = (ingredient = inputValue) => {
    const normalizedIngredient = ingredient.trim().toLowerCase();
    
    if (normalizedIngredient && !ingredients.includes(normalizedIngredient)) {
      const newIngredients = [...ingredients, normalizedIngredient];
      onIngredientsChange(newIngredients);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleAddIngredient(suggestion);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    const newIngredients = ingredients.filter(ingredient => ingredient !== ingredientToRemove);
    onIngredientsChange(newIngredients);
  };

  const handleImageIngredients = (detectedIngredients) => {
    const newIngredients = [...new Set([...ingredients, ...detectedIngredients])];
    onIngredientsChange(newIngredients);
  };

  const handleClearAll = () => {
    onIngredientsChange([]);
  };

  return (
    <div className="ingredient-input">
      <div className="ingredient-input-header">
        <h2>Add Your Ingredients</h2>
        <p>Type ingredients or upload a photo to get started</p>
      </div>
      
      <div className="input-methods">
        <div className="text-input-container">
          <div className="text-input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => inputValue.length > 1 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Type an ingredient (e.g., chicken, tomatoes, rice)"
              className="ingredient-text-input"
              autoComplete="off"
            />
            <button 
              onClick={() => handleAddIngredient()} 
              className="add-btn"
              disabled={!inputValue.trim()}
            >
              Add
            </button>
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="image-input">
          <button
            onClick={() => setIsImageUploadOpen(true)}
            className="image-upload-btn"
            title="Upload ingredient photo"
          >
            <span className="btn-icon">📷</span>
            <span className="btn-text">Upload Photo</span>
          </button>
        </div>
      </div>

      {ingredients.length > 0 && (
        <div className="ingredients-list">
          <div className="ingredients-header">
            <h3>Your Ingredients ({ingredients.length})</h3>
            <button onClick={handleClearAll} className="clear-all-btn">
              Clear All
            </button>
          </div>
          <div className="ingredient-tags">
            {ingredients.map((ingredient, index) => (
              <span key={index} className="ingredient-tag">
                <span className="ingredient-name">{ingredient}</span>
                <button
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="remove-btn"
                  title={`Remove ${ingredient}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {isImageUploadOpen && (
        <ImageUpload
          onClose={() => setIsImageUploadOpen(false)}
          onIngredientsDetected={handleImageIngredients}
        />
      )}
    </div>
  );
};

export default IngredientInput;
