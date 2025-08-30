import recipesData from '../data/recipes.json';

// Cache for better performance
let recipesCache = null;
let lastCacheUpdate = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Initialize and validate recipe data
const initializeRecipes = () => {
  if (!recipesCache || (Date.now() - lastCacheUpdate > CACHE_DURATION)) {
    recipesCache = recipesData.recipes.map(recipe => ({
      ...recipe,
      id: recipe.id || generateId(),
      matchPercentage: recipe.matchPercentage || 0,
      nutrition: recipe.nutrition || getDefaultNutrition(),
      dietary: recipe.dietary || [],
      tips: recipe.tips || [],
      substitutions: recipe.substitutions || [],
      servings: recipe.servings || 4,
      prepTime: recipe.prepTime || Math.floor(recipe.cookingTime * 0.3),
      totalTime: (recipe.prepTime || Math.floor(recipe.cookingTime * 0.3)) + recipe.cookingTime,
      tags: generateTags(recipe)
    }));
    lastCacheUpdate = Date.now();
  }
  return recipesCache;
};

// Get all recipes
export const getRecipes = () => {
  return initializeRecipes();
};

// Get recipe by ID
export const getRecipeById = (id) => {
  const recipes = getRecipes();
  return recipes.find(recipe => recipe.id === id);
};

// Search recipes by ingredients with advanced matching
export const searchRecipesByIngredients = (ingredients, options = {}) => {
  const { limit = 50, minMatchPercentage = 0 } = options;
  
  if (!ingredients || ingredients.length === 0) {
    return getRecipes().slice(0, limit);
  }
  
  const recipes = getRecipes();
  const normalizedIngredients = ingredients.map(ing => normalizeIngredient(ing));
  
  return recipes
    .map(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => 
        normalizeIngredient(ing.name)
      );
      
      const matchResult = calculateIngredientMatch(normalizedIngredients, recipeIngredients);
      
      return {
        ...recipe,
        matchPercentage: matchResult.percentage,
        matchedIngredients: matchResult.matched,
        missingIngredients: matchResult.missing,
        substitutableIngredients: matchResult.substitutable
      };
    })
    .filter(recipe => recipe.matchPercentage >= minMatchPercentage)
    .sort((a, b) => {
      // Primary sort: match percentage
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      // Secondary sort: fewer missing ingredients
      return a.missingIngredients.length - b.missingIngredients.length;
    })
    .slice(0, limit);
};

// Advanced ingredient matching algorithm
const calculateIngredientMatch = (userIngredients, recipeIngredients) => {
  let matched = [];
  let missing = [];
  let substitutable = [];
  let exactMatches = 0;
  let partialMatches = 0;
  let substitutionMatches = 0;
  
  recipeIngredients.forEach(recipeIng => {
    let matchType = 'none';
    let matchedWith = null;
    
    // Check for exact matches
    for (const userIng of userIngredients) {
      if (recipeIng === userIng) {
        matchType = 'exact';
        matchedWith = userIng;
        exactMatches++;
        break;
      }
    }
    
    // Check for partial matches if no exact match
    if (matchType === 'none') {
      for (const userIng of userIngredients) {
        if (isPartialMatch(recipeIng, userIng)) {
          matchType = 'partial';
          matchedWith = userIng;
          partialMatches++;
          break;
        }
      }
    }
    
    // Check for substitution matches if no other match
    if (matchType === 'none') {
      for (const userIng of userIngredients) {
        if (canSubstitute(recipeIng, userIng)) {
          matchType = 'substitution';
          matchedWith = userIng;
          substitutionMatches++;
          break;
        }
      }
    }
    
    // Categorize the ingredient
    if (matchType !== 'none') {
      matched.push({ ingredient: recipeIng, matchedWith, type: matchType });
      if (matchType === 'substitution') {
        substitutable.push({ original: recipeIng, substitute: matchedWith });
      }
    } else {
      missing.push(recipeIng);
    }
  });
  
  // Calculate weighted match percentage
  const totalIngredients = recipeIngredients.length;
  const weightedScore = (exactMatches * 1.0) + (partialMatches * 0.7) + (substitutionMatches * 0.5);
  const percentage = Math.round((weightedScore / totalIngredients) * 100);
  
  return {
    percentage: Math.min(100, Math.max(0, percentage)),
    matched: matched.map(m => m.ingredient),
    missing,
    substitutable,
    score: {
      exact: exactMatches,
      partial: partialMatches,
      substitution: substitutionMatches,
      total: weightedScore
    }
  };
};

// Filter recipes by various criteria
export const filterRecipes = (recipes, filters) => {
  return recipes.filter(recipe => {
    // Dietary filter
    if (filters.dietary && !recipe.dietary.some(diet => 
      diet.toLowerCase().includes(filters.dietary.toLowerCase())
    )) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false;
    }
    
    // Cooking time filter
    if (filters.maxCookingTime && recipe.cookingTime > parseInt(filters.maxCookingTime)) {
      return false;
    }
    
    // Cuisine filter
    if (filters.cuisine && recipe.cuisine !== filters.cuisine) {
      return false;
    }
    
    // Additional filters
    if (filters.maxCalories && recipe.nutrition.calories > parseInt(filters.maxCalories)) {
      return false;
    }
    
    if (filters.minProtein && recipe.nutrition.protein < parseInt(filters.minProtein)) {
      return false;
    }
    
    return true;
  });
};

// Get recipes by cuisine
export const getRecipesByCuisine = (cuisine, limit = 10) => {
  const recipes = getRecipes();
  return recipes
    .filter(recipe => recipe.cuisine.toLowerCase() === cuisine.toLowerCase())
    .slice(0, limit);
};

// Get recipes by dietary preference
export const getRecipesByDietary = (dietary, limit = 10) => {
  const recipes = getRecipes();
  return recipes
    .filter(recipe => recipe.dietary.some(diet => 
      diet.toLowerCase().includes(dietary.toLowerCase())
    ))
    .slice(0, limit);
};

// Get popular/trending recipes
export const getPopularRecipes = (limit = 10) => {
  const recipes = getRecipes();
  
  // Mock popularity based on multiple factors
  return recipes
    .map(recipe => ({
      ...recipe,
      popularityScore: calculatePopularityScore(recipe)
    }))
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit);
};

// Get random recipes for discovery
export const getRandomRecipes = (count = 5) => {
  const recipes = getRecipes();
  const shuffled = [...recipes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Search recipes by name, description, or cuisine
export const searchRecipesByName = (query, limit = 20) => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const recipes = getRecipes();
  const normalizedQuery = query.toLowerCase().trim();
  
  return recipes
    .filter(recipe =>
      recipe.name.toLowerCase().includes(normalizedQuery) ||
      recipe.description.toLowerCase().includes(normalizedQuery) ||
      recipe.cuisine.toLowerCase().includes(normalizedQuery) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
    )
    .slice(0, limit);
};

// Get recipe statistics
export const getRecipeStats = () => {
  const recipes = getRecipes();
  
  const cuisines = [...new Set(recipes.map(r => r.cuisine))];
  const difficulties = [...new Set(recipes.map(r => r.difficulty))];
  const dietaryOptions = [...new Set(recipes.flatMap(r => r.dietary))];
  
  const avgCookTime = Math.round(
    recipes.reduce((sum, r) => sum + r.cookingTime, 0) / recipes.length
  );
  
  const avgCalories = Math.round(
    recipes.reduce((sum, r) => sum + r.nutrition.calories, 0) / recipes.length
  );
  
  return {
    total: recipes.length,
    cuisines: {
      count: cuisines.length,
      list: cuisines.sort()
    },
    difficulties: {
      count: difficulties.length,
      list: difficulties
    },
    dietary: {
      count: dietaryOptions.length,
      list: dietaryOptions.sort()
    },
    averages: {
      cookingTime: avgCookTime,
      calories: avgCalories
    },
    ranges: {
      cookingTime: {
        min: Math.min(...recipes.map(r => r.cookingTime)),
        max: Math.max(...recipes.map(r => r.cookingTime))
      },
      calories: {
        min: Math.min(...recipes.map(r => r.nutrition.calories)),
        max: Math.max(...recipes.map(r => r.nutrition.calories))
      }
    }
  };
};

// Get ingredient suggestions from all recipes
export const getIngredientSuggestions = (partial = '') => {
  const recipes = getRecipes();
  const allIngredients = new Set();
  
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const normalized = normalizeIngredient(ingredient.name);
      if (!partial || normalized.includes(partial.toLowerCase())) {
        allIngredients.add(normalized);
      }
    });
  });
  
  return Array.from(allIngredients).sort().slice(0, 50);
};

// Helper functions
const normalizeIngredient = (ingredient) => {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/s$/, '') // Remove plural 's'
    .trim();
};

const isPartialMatch = (recipeIngredient, userIngredient) => {
  const recipe = normalizeIngredient(recipeIngredient);
  const user = normalizeIngredient(userIngredient);
  
  return recipe.includes(user) || user.includes(recipe) || 
         getIngredientVariations(recipe).some(variation => 
           variation === user || variation.includes(user) || user.includes(variation)
         );
};

const canSubstitute = (recipeIngredient, userIngredient) => {
  const substitutions = getIngredientSubstitutions();
  const recipe = normalizeIngredient(recipeIngredient);
  const user = normalizeIngredient(userIngredient);
  
  return substitutions[recipe]?.includes(user) || substitutions[user]?.includes(recipe);
};

const getIngredientVariations = (ingredient) => {
  const variationMap = {
    'tomato': ['tomatoes', 'cherry tomatoes', 'roma tomatoes', 'plum tomatoes'],
    'onion': ['onions', 'yellow onion', 'white onion', 'red onion', 'sweet onion'],
    'pepper': ['bell pepper', 'bell peppers', 'capsicum', 'sweet pepper'],
    'chicken': ['chicken breast', 'chicken thigh', 'chicken meat', 'poultry'],
    'beef': ['ground beef', 'beef mince', 'minced beef', 'hamburger meat'],
    'cheese': ['cheddar cheese', 'mozzarella cheese', 'parmesan cheese'],
    'pasta': ['spaghetti', 'penne', 'fusilli', 'macaroni', 'noodles'],
    'rice': ['white rice', 'brown rice', 'jasmine rice', 'basmati rice'],
    'oil': ['olive oil', 'vegetable oil', 'cooking oil', 'canola oil']
  };
  
  return variationMap[ingredient] || [ingredient];
};

const getIngredientSubstitutions = () => {
  return {
    'butter': ['margarine', 'oil', 'coconut oil', 'ghee'],
    'milk': ['almond milk', 'soy milk', 'coconut milk', 'oat milk'],
    'egg': ['flax egg', 'chia egg', 'applesauce', 'mashed banana'],
    'flour': ['almond flour', 'coconut flour', 'whole wheat flour'],
    'sugar': ['honey', 'maple syrup', 'stevia', 'agave'],
    'sour cream': ['greek yogurt', 'plain yogurt'],
    'heavy cream': ['coconut cream', 'evaporated milk'],
    'breadcrumb': ['crushed crackers', 'panko', 'oatmeal'],
    'wine': ['broth', 'grape juice', 'vinegar'],
    'lemon juice': ['lime juice', 'vinegar'],
    'garlic': ['garlic powder', 'shallot'],
    'onion': ['shallot', 'onion powder'],
    'fresh herb': ['dried herb'],
    'chicken broth': ['vegetable broth', 'beef broth'],
    'ground beef': ['ground turkey', 'ground chicken', 'plant-based meat']
  };
};

const generateTags = (recipe) => {
  const tags = [];
  
  // Add cuisine-based tags
  tags.push(recipe.cuisine.toLowerCase());
  
  // Add difficulty-based tags
  tags.push(recipe.difficulty.toLowerCase());
  
  // Add dietary tags
  recipe.dietary.forEach(diet => tags.push(diet.toLowerCase().replace(/[^a-z0-9]/g, '')));
  
  // Add time-based tags
  if (recipe.cookingTime <= 15) tags.push('quick', 'fast');
  else if (recipe.cookingTime <= 30) tags.push('moderate');
  else tags.push('slow');
  
  // Add ingredient-based tags
  const commonIngredients = ['chicken', 'beef', 'pork', 'fish', 'vegetable', 'pasta', 'rice'];
  recipe.ingredients.forEach(ing => {
    const normalized = normalizeIngredient(ing.name);
    commonIngredients.forEach(common => {
      if (normalized.includes(common)) {
        tags.push(common);
      }
    });
  });
  
  return [...new Set(tags)];
};

const calculatePopularityScore = (recipe) => {
  let score = 0;
  
  // Quick recipes are more popular
  if (recipe.cookingTime <= 30) score += 20;
  else if (recipe.cookingTime <= 60) score += 10;
  
  // Easy recipes are more popular
  if (recipe.difficulty === 'Easy') score += 15;
  else if (recipe.difficulty === 'Medium') score += 10;
  
  // Recipes with dietary options are more popular
  score += recipe.dietary.length * 5;
  
  // Balanced nutrition adds to popularity
  const nutrition = recipe.nutrition;
  if (nutrition.protein > 20) score += 5;
  if (nutrition.calories < 500) score += 5;
  if (nutrition.fiber > 5) score += 3;
  
  // Random factor for variety
  score += Math.random() * 20;
  
  return Math.round(score);
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getDefaultNutrition = () => ({
  calories: 300,
  protein: 15,
  carbs: 35,
  fat: 12,
  fiber: 4,
  sugar: 8,
  sodium: 400
});

// Recipe validation
export const validateRecipe = (recipe) => {
  const requiredFields = ['name', 'ingredients', 'instructions', 'nutrition'];
  return requiredFields.every(field => {
    if (field === 'ingredients' || field === 'instructions') {
      return recipe[field] && Array.isArray(recipe[field]) && recipe[field].length > 0;
    }
    return recipe[field] && typeof recipe[field] !== 'undefined';
  });
};

// Export for testing
export { normalizeIngredient, calculateIngredientMatch };
