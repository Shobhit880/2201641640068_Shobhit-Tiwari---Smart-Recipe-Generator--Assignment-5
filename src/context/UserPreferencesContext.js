import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UserPreferencesContext = createContext();

// User preferences reducer
const preferencesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DIETARY_PREFERENCES':
      return {
        ...state,
        dietary: action.payload
      };
    
    case 'SET_CUISINE_PREFERENCES':
      return {
        ...state,
        cuisines: action.payload
      };
    
    case 'SET_DIFFICULTY_PREFERENCE':
      return {
        ...state,
        difficulty: action.payload
      };
    
    case 'SET_COOKING_TIME_PREFERENCE':
      return {
        ...state,
        maxCookingTime: action.payload
      };
    
    case 'UPDATE_INGREDIENT_HISTORY':
      return {
        ...state,
        recentIngredients: [
          ...new Set([...action.payload, ...state.recentIngredients])
        ].slice(0, 20) // Keep only 20 most recent
      };
    
    case 'UPDATE_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [
          action.payload,
          ...state.searchHistory.filter(term => term !== action.payload)
        ].slice(0, 10) // Keep only 10 most recent
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      };
    
    case 'RESET_PREFERENCES':
      return initialState;
    
    default:
      return state;
  }
};

const initialState = {
  dietary: [],
  cuisines: [],
  difficulty: '',
  maxCookingTime: '',
  recentIngredients: [],
  searchHistory: [],
  theme: 'light',
  language: 'en'
};

export const UserPreferencesProvider = ({ children }) => {
  // Use localStorage to persist preferences
  const [storedPreferences, setStoredPreferences] = useLocalStorage('user-preferences', initialState);
  const [state, dispatch] = useReducer(preferencesReducer, storedPreferences);

  // Sync state with localStorage whenever it changes
  useEffect(() => {
    setStoredPreferences(state);
  }, [state, setStoredPreferences]);

  // Action creators
  const setDietaryPreferences = (dietary) => {
    dispatch({ type: 'SET_DIETARY_PREFERENCES', payload: dietary });
  };

  const setCuisinePreferences = (cuisines) => {
    dispatch({ type: 'SET_CUISINE_PREFERENCES', payload: cuisines });
  };

  const setDifficultyPreference = (difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY_PREFERENCE', payload: difficulty });
  };

  const setCookingTimePreference = (maxCookingTime) => {
    dispatch({ type: 'SET_COOKING_TIME_PREFERENCE', payload: maxCookingTime });
  };

  const updateIngredientHistory = (ingredients) => {
    dispatch({ type: 'UPDATE_INGREDIENT_HISTORY', payload: ingredients });
  };

  const updateSearchHistory = (searchTerm) => {
    if (searchTerm.trim()) {
      dispatch({ type: 'UPDATE_SEARCH_HISTORY', payload: searchTerm.trim() });
    }
  };

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  };

  const setLanguage = (language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const resetPreferences = () => {
    dispatch({ type: 'RESET_PREFERENCES' });
  };

  // Auto-update preferences based on user behavior
  const updatePreferences = ({ ingredients, filters, favorites, ratings }) => {
    // Update ingredient history
    if (ingredients && ingredients.length > 0) {
      updateIngredientHistory(ingredients);
    }

    // Update dietary preferences based on favorites
    if (favorites && favorites.length > 0) {
      // This would be more sophisticated in a real app
      // For now, we'll keep it simple
    }
  };

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const value = {
    preferences: state,
    setDietaryPreferences,
    setCuisinePreferences,
    setDifficultyPreference,
    setCookingTimePreference,
    updateIngredientHistory,
    updateSearchHistory,
    setTheme,
    setLanguage,
    resetPreferences,
    updatePreferences
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
