import { useState, useEffect, useCallback } from 'react';
import { findMatchingRecipes } from '../utils/recipeMatchingAlgorithm';
import { getRecipes, filterRecipes } from '../services/recipeDatabase';

export const useRecipeSearch = (ingredients, filters) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let allRecipes = getRecipes();
      let matchedRecipes;

      if (!ingredients || ingredients.length === 0) {
        // No ingredients provided, just apply filters
        matchedRecipes = filterRecipes(allRecipes, filters);
      } else {
        // Find recipes matching ingredients
        matchedRecipes = findMatchingRecipes(ingredients, allRecipes, filters);
      }

      setRecipes(matchedRecipes);
    } catch (err) {
      const errorMessage = 'Failed to search recipes. Please try again.';
      setError(errorMessage);
      console.error('Recipe search error:', err);
    } finally {
      setLoading(false);
    }
  }, [ingredients, filters]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchRecipes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchRecipes]);

  const refetch = useCallback(() => {
    searchRecipes();
  }, [searchRecipes]);

  return {
    recipes,
    loading,
    error,
    refetch
  };
};
