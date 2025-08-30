// Advanced recipe matching with multiple scoring factors
export const findMatchingRecipes = (userIngredients, allRecipes, filters = {}) => {
  if (!userIngredients || userIngredients.length === 0) {
    return filterRecipesByPreferences(allRecipes, filters);
  }

  const normalizedUserIngredients = userIngredients.map(ingredient => 
    normalizeIngredient(ingredient)
  );

  // Score each recipe
  const scoredRecipes = allRecipes.map(recipe => {
    const score = calculateRecipeScore(recipe, normalizedUserIngredients);
    return {
      ...recipe,
      matchPercentage: score.percentage,
      matchedIngredients: score.matched,
      missingIngredients: score.missing,
      substitutableIngredients: score.substitutable,
      score: score.total
    };
  });

  // Filter by minimum match threshold
  const matchedRecipes = scoredRecipes.filter(recipe => recipe.matchPercentage >= 10);

  // Apply user preference filters
  const filteredRecipes = filterRecipesByPreferences(matchedRecipes, filters);

  // Sort by comprehensive relevance score
  return filteredRecipes.sort((a, b) => {
    // Primary: match percentage
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    // Secondary: fewer missing ingredients
    if (a.missingIngredients.length !== b.missingIngredients.length) {
      return a.missingIngredients.length - b.missingIngredients.length;
    }
    // Tertiary: overall score
    return b.score - a.score;
  });
};

const calculateRecipeScore = (recipe, userIngredients) => {
  const recipeIngredients = recipe.ingredients.map(ing => 
    normalizeIngredient(ing.name)
  );

  let matched = [];
  let missing = [];
  let substitutable = [];
  let exactMatches = 0;
  let partialMatches = 0;
  let substitutionMatches = 0;

  // Analyze each recipe ingredient
  recipeIngredients.forEach(recipeIng => {
    const match = findBestMatch(recipeIng, userIngredients);
    
    switch (match.type) {
      case 'exact':
        matched.push(recipeIng);
        exactMatches++;
        break;
      case 'partial':
        matched.push(recipeIng);
        partialMatches++;
        break;
      case 'substitute':
        matched.push(recipeIng);
        substitutable.push({ original: recipeIng, substitute: match.ingredient });
        substitutionMatches++;
        break;
      default:
        missing.push(recipeIng);
    }
  });

  // Calculate weighted match percentage
  const totalIngredients = recipeIngredients.length;
  const matchedCount = exactMatches + (partialMatches * 0.8) + (substitutionMatches * 0.6);
  const percentage = Math.round((matchedCount / totalIngredients) * 100);

  // Calculate bonus factors
  let totalScore = percentage;
  
  // Bonus for using more user ingredients
  const userIngredientsUsed = userIngredients.filter(userIng =>
    recipeIngredients.some(recipeIng => 
      findBestMatch(recipeIng, [userIng]).type !== 'none'
    )
  ).length;
  
  const ingredientUsageBonus = (userIngredientsUsed / userIngredients.length) * 15;
  totalScore += ingredientUsageBonus;

  // Bonus for simpler recipes when user has few ingredients
  if (userIngredients.length <= 3 && totalIngredients <= 6) {
    totalScore += 10;
  }

  // Bonus for recipes with common staples
  const hasStaples = recipeIngredients.some(ing => 
    ['salt', 'pepper', 'oil', 'water'].includes(ing)
  );
  if (hasStaples) totalScore += 5;

  return {
    percentage: Math.min(100, Math.max(0, percentage)),
    matched,
    missing,
    substitutable,
    total: totalScore,
    exactMatches,
    partialMatches,
    substitutionMatches
  };
};

const findBestMatch = (recipeIngredient, userIngredients) => {
  const recipeIng = recipeIngredient.toLowerCase();
  
  // Check exact matches first
  for (const userIng of userIngredients) {
    if (recipeIng === userIng.toLowerCase()) {
      return { type: 'exact', ingredient: userIng };
    }
  }

  // Check partial matches
  for (const userIng of userIngredients) {
    if (isPartialMatch(recipeIng, userIng.toLowerCase())) {
      return { type: 'partial', ingredient: userIng };
    }
  }

  // Check substitutions
  for (const userIng of userIngredients) {
    if (areSubstitutable(recipeIng, userIng.toLowerCase())) {
      return { type: 'substitute', ingredient: userIng };
    }
  }

  return { type: 'none' };
};

const isPartialMatch = (recipeIngredient, userIngredient) => {
  // Direct contains check
  if (recipeIngredient.includes(userIngredient) || userIngredient.includes(recipeIngredient)) {
    return true;
  }

  // Check variations
  const variations = getIngredientVariations(recipeIngredient);
  return variations.some(variation => 
    variation === userIngredient || 
    variation.includes(userIngredient) || 
    userIngredient.includes(variation)
  );
};

const areSubstitutable = (recipeIngredient, userIngredient) => {
  const substitutions = getIngredientSubstitutions();
  
  // Check if user ingredient can substitute recipe ingredient
  if (substitutions[recipeIngredient]) {
    return substitutions[recipeIngredient].some(sub => 
      sub.toLowerCase() === userIngredient ||
      sub.toLowerCase().includes(userIngredient) ||
      userIngredient.includes(sub.toLowerCase())
    );
  }

  // Check reverse substitution
  if (substitutions[userIngredient]) {
    return substitutions[userIngredient].some(sub => 
      sub.toLowerCase() === recipeIngredient ||
      sub.toLowerCase().includes(recipeIngredient) ||
      recipeIngredient.includes(sub.toLowerCase())
    );
  }

  return false;
};

// Normalize ingredient names for consistent matching
export const normalizeIngredient = (ingredient) => {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/s$/, '') // Remove plural 's'
    .trim();
};

// Get ingredient variations for better matching
const getIngredientVariations = (ingredient) => {
  const variationMap = {
    'tomato': ['tomatoes', 'cherry tomatoes', 'roma tomatoes', 'plum tomatoes', 'vine tomatoes'],
    'onion': ['onions', 'yellow onion', 'white onion', 'red onion', 'sweet onion', 'shallot'],
    'pepper': ['bell pepper', 'bell peppers', 'capsicum', 'sweet pepper'],
    'chicken': ['chicken breast', 'chicken thigh', 'chicken meat', 'poultry'],
    'beef': ['ground beef', 'beef mince', 'minced beef', 'hamburger meat', 'steak'],
    'cheese': ['cheddar cheese', 'mozzarella cheese', 'parmesan cheese', 'swiss cheese'],
    'pasta': ['spaghetti', 'penne', 'fusilli', 'macaroni', 'noodles', 'linguine'],
    'rice': ['white rice', 'brown rice', 'jasmine rice', 'basmati rice', 'wild rice'],
    'oil': ['olive oil', 'vegetable oil', 'cooking oil', 'canola oil', 'sunflower oil'],
    'herb': ['fresh herbs', 'dried herbs', 'basil', 'oregano', 'thyme', 'rosemary'],
    'spice': ['spices', 'seasoning', 'black pepper', 'paprika', 'cumin']
  };

  return variationMap[ingredient] || [ingredient];
};

// Comprehensive substitution database
const getIngredientSubstitutions = () => {
  return {
    // Dairy substitutions
    'butter': ['margarine', 'coconut oil', 'vegetable oil', 'ghee'],
    'milk': ['almond milk', 'soy milk', 'coconut milk', 'oat milk', 'rice milk'],
    'heavy cream': ['coconut cream', 'evaporated milk', 'half and half'],
    'sour cream': ['greek yogurt', 'plain yogurt', 'creme fraiche'],
    'cheese': ['nutritional yeast', 'cashew cheese', 'vegan cheese'],
    
    // Protein substitutions
    'eggs': ['flax eggs', 'chia eggs', 'applesauce', 'mashed banana', 'aquafaba'],
    'chicken': ['turkey', 'tofu', 'tempeh', 'seitan', 'cauliflower'],
    'beef': ['ground turkey', 'lentils', 'mushrooms', 'plant-based meat'],
    'fish': ['tofu', 'tempeh', 'hearts of palm', 'banana peels'],
    
    // Flour and grains
    'wheat flour': ['almond flour', 'coconut flour', 'oat flour', 'rice flour'],
    'bread': ['tortillas', 'rice cakes', 'lettuce wraps', 'cauliflower bread'],
    'pasta': ['zucchini noodles', 'spaghetti squash', 'shirataki noodles'],
    'rice': ['quinoa', 'cauliflower rice', 'barley', 'bulgur'],
    
    // Sweeteners
    'sugar': ['honey', 'maple syrup', 'stevia', 'agave', 'coconut sugar'],
    'honey': ['maple syrup', 'agave', 'brown rice syrup'],
    
    // Other common substitutions
    'breadcrumbs': ['crushed crackers', 'panko', 'rolled oats', 'ground nuts'],
    'wine': ['broth', 'grape juice', 'apple cider vinegar'],
    'lemon juice': ['lime juice', 'white wine vinegar', 'apple cider vinegar'],
    'garlic': ['garlic powder', 'shallots', 'onion powder'],
    'onion': ['shallots', 'leeks', 'onion powder'],
    'fresh herbs': ['dried herbs'],
    'tomato sauce': ['tomato paste', 'crushed tomatoes', 'marinara sauce'],
    'broth': ['bouillon', 'stock', 'vegetable broth', 'water with seasoning']
  };
};

// Filter recipes by user preferences
const filterRecipesByPreferences = (recipes, filters) => {
  return recipes.filter(recipe => {
    // Dietary restrictions
    if (filters.dietary && filters.dietary !== '') {
      if (!recipe.dietary || !recipe.dietary.some(diet => 
        diet.toLowerCase().includes(filters.dietary.toLowerCase())
      )) {
        return false;
      }
    }

    // Difficulty level
    if (filters.difficulty && filters.difficulty !== '') {
      if (recipe.difficulty !== filters.difficulty) {
        return false;
      }
    }

    // Maximum cooking time
    if (filters.maxCookingTime && filters.maxCookingTime !== '') {
      const maxTime = parseInt(filters.maxCookingTime);
      if (recipe.cookingTime > maxTime) {
        return false;
      }
    }

    // Cuisine type
    if (filters.cuisine && filters.cuisine !== '') {
      if (recipe.cuisine !== filters.cuisine) {
        return false;
      }
    }

    return true;
  });
};

// Get personalized recipe suggestions based on user behavior
export const getPersonalizedSuggestions = (allRecipes, userRatings, userFavorites, userIngredients = []) => {
  // Get highly rated recipes (4+ stars)
  const highlyRated = Object.entries(userRatings)
    .filter(([_, rating]) => rating >= 4)
    .map(([recipeId, _]) => recipeId);

  // Analyze user preferences
  const preferences = analyzeUserPreferences(allRecipes, highlyRated, userFavorites);

  // Score recipes based on preferences
  const scoredRecipes = allRecipes
    .filter(recipe => !userFavorites.includes(recipe.id)) // Exclude favorites
    .map(recipe => ({
      ...recipe,
      suggestionScore: calculateSuggestionScore(recipe, preferences, userIngredients)
    }))
    .filter(recipe => recipe.suggestionScore > 0)
    .sort((a, b) => b.suggestionScore - a.suggestionScore);

  return scoredRecipes.slice(0, 12);
};

const analyzeUserPreferences = (allRecipes, highlyRatedIds, favoriteIds) => {
  const preferredRecipes = allRecipes.filter(recipe => 
    highlyRatedIds.includes(recipe.id) || favoriteIds.includes(recipe.id)
  );

  const preferences = {
    cuisines: {}, difficulties: {}, cookingTimes: { fast: 0, medium: 0, slow: 0 },
    ingredients: {}, dietary: {}
  };

  preferredRecipes.forEach(recipe => {
    // Cuisine preferences
    preferences.cuisines[recipe.cuisine] = (preferences.cuisines[recipe.cuisine] || 0) + 1;

    // Difficulty preferences
    preferences.difficulties[recipe.difficulty] = (preferences.difficulties[recipe.difficulty] || 0) + 1;

    // Cooking time preferences
    if (recipe.cookingTime <= 20) preferences.cookingTimes.fast++;
    else if (recipe.cookingTime <= 45) preferences.cookingTimes.medium++;
    else preferences.cookingTimes.slow++;

    // Ingredient preferences
    recipe.ingredients.forEach(ing => {
      const normalized = normalizeIngredient(ing.name);
      preferences.ingredients[normalized] = (preferences.ingredients[normalized] || 0) + 1;
    });

    // Dietary preferences
    recipe.dietary.forEach(diet => {
      preferences.dietary[diet] = (preferences.dietary[diet] || 0) + 1;
    });
  });

  return preferences;
};

const calculateSuggestionScore = (recipe, preferences, userIngredients) => {
  let score = 0;

  // Cuisine preference bonus
  const cuisineCount = preferences.cuisines[recipe.cuisine] || 0;
  score += cuisineCount * 15;

  // Difficulty preference bonus
  const difficultyCount = preferences.difficulties[recipe.difficulty] || 0;
  score += difficultyCount * 8;

  // Cooking time preference bonus
  let timeCategory = 'medium';
  if (recipe.cookingTime <= 20) timeCategory = 'fast';
  else if (recipe.cookingTime > 45) timeCategory = 'slow';
  
  score += preferences.cookingTimes[timeCategory] * 5;

  // Ingredient preference bonus
  recipe.ingredients.forEach(ing => {
    const normalized = normalizeIngredient(ing.name);
    const count = preferences.ingredients[normalized] || 0;
    score += count * 3;
  });

  // Dietary preference bonus
  recipe.dietary.forEach(diet => {
    const count = preferences.dietary[diet] || 0;
    score += count * 12;
  });

  // Available ingredients bonus
  if (userIngredients.length > 0) {
    const matchResult = calculateRecipeScore(recipe, userIngredients.map(normalizeIngredient));
    score += matchResult.percentage * 0.4;
  }

  return Math.round(score);
};

// Export utility functions
export { getIngredientSubstitutions, getIngredientVariations };
