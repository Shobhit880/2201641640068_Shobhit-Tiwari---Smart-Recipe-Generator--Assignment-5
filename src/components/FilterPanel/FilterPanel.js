import React, { useState } from 'react';
import './FilterPanel.css';
import { DIETARY_OPTIONS, DIFFICULTY_OPTIONS, CUISINE_OPTIONS } from '../../utils/constants';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({
      dietary: '',
      difficulty: '',
      maxCookingTime: '',
      cuisine: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');
  const activeFiltersCount = Object.values(filters).filter(filter => filter !== '').length;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <div className="filter-title-section">
          <h3>Filter Recipes</h3>
          {activeFiltersCount > 0 && (
            <span className="active-filters-count">{activeFiltersCount} active</span>
          )}
        </div>
        <div className="filter-actions">
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="clear-filters-btn">
              Clear All
            </button>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="expand-btn"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </button>
        </div>
      </div>
      
      <div className={`filters-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="dietary-filter" className="filter-label">
              Dietary Preferences
            </label>
            <select
              id="dietary-filter"
              value={filters.dietary}
              onChange={(e) => handleFilterChange('dietary', e.target.value)}
              className="filter-select"
            >
              <option value="">All Diets</option>
              {DIETARY_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="difficulty-filter" className="filter-label">
              Difficulty Level
            </label>
            <select
              id="difficulty-filter"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="filter-select"
            >
              <option value="">All Levels</option>
              {DIFFICULTY_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className={`filter-group ${!isExpanded ? 'mobile-hidden' : ''}`}>
            <label htmlFor="cuisine-filter" className="filter-label">
              Cuisine Type
            </label>
            <select
              id="cuisine-filter"
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              className="filter-select"
            >
              <option value="">All Cuisines</option>
              {CUISINE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className={`filter-group ${!isExpanded ? 'mobile-hidden' : ''}`}>
            <label htmlFor="cooking-time-filter" className="filter-label">
              Max Cooking Time (minutes)
            </label>
            <div className="time-input-wrapper">
              <input
                id="cooking-time-filter"
                type="number"
                value={filters.maxCookingTime}
                onChange={(e) => handleFilterChange('maxCookingTime', e.target.value)}
                placeholder="e.g., 30"
                className="filter-input"
                min="5"
                max="300"
                step="5"
              />
              <div className="time-presets">
                {[15, 30, 60].map(time => (
                  <button
                    key={time}
                    onClick={() => handleFilterChange('maxCookingTime', time.toString())}
                    className={`time-preset ${filters.maxCookingTime === time.toString() ? 'active' : ''}`}
                    type="button"
                  >
                    {time}min
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="active-filters">
            <h4>Active Filters:</h4>
            <div className="filter-tags">
              {filters.dietary && (
                <span className="filter-tag">
                  <span className="filter-tag-label">Diet:</span>
                  <span className="filter-tag-value">{filters.dietary}</span>
                  <button
                    onClick={() => handleFilterChange('dietary', '')}
                    className="remove-filter"
                    title="Remove dietary filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.difficulty && (
                <span className="filter-tag">
                  <span className="filter-tag-label">Difficulty:</span>
                  <span className="filter-tag-value">{filters.difficulty}</span>
                  <button
                    onClick={() => handleFilterChange('difficulty', '')}
                    className="remove-filter"
                    title="Remove difficulty filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.cuisine && (
                <span className="filter-tag">
                  <span className="filter-tag-label">Cuisine:</span>
                  <span className="filter-tag-value">{filters.cuisine}</span>
                  <button
                    onClick={() => handleFilterChange('cuisine', '')}
                    className="remove-filter"
                    title="Remove cuisine filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.maxCookingTime && (
                <span className="filter-tag">
                  <span className="filter-tag-label">Max Time:</span>
                  <span className="filter-tag-value">{filters.maxCookingTime}min</span>
                  <button
                    onClick={() => handleFilterChange('maxCookingTime', '')}
                    className="remove-filter"
                    title="Remove time filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
