import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getRecipes } from '../services/recipeDatabase';

const RecipeContext = createContext();

// Recipe state reducer
const recipeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RECIPES':
      return {
        ...state,
        recipes: action.payload,
        loading: false,
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id
            ? { ...recipe, ...action.payload.updates }
            : recipe
        )
      };
    
    case 'ADD_RECIPE':
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    
    case 'DELETE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload)
      };
    
    default:
      return state;
  }
};

const initialState = {
  recipes: [],
  loading: true,
  error: null
};

export const RecipeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  // Load recipes on mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const recipes = getRecipes();
        dispatch({ type: 'SET_RECIPES', payload: recipes });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load recipes' });
      }
    };

    loadRecipes();
  }, []);

  // Action creators
  const updateRecipe = (id, updates) => {
    dispatch({ type: 'UPDATE_RECIPE', payload: { id, updates } });
  };

  const addRecipe = (recipe) => {
    dispatch({ type: 'ADD_RECIPE', payload: recipe });
  };

  const deleteRecipe = (id) => {
    dispatch({ type: 'DELETE_RECIPE', payload: id });
  };

  const refreshRecipes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const recipes = getRecipes();
      dispatch({ type: 'SET_RECIPES', payload: recipes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh recipes' });
    }
  };

  const value = {
    ...state,
    updateRecipe,
    addRecipe,
    deleteRecipe,
    refreshRecipes
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};
