// Comprehensive nutrition database per 100g
const NUTRITION_DATABASE = {
  // Proteins
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 17, fiber: 0, sugar: 0, sodium: 72 },
  'pork': { calories: 242, protein: 27, carbs: 0, fat: 14, fiber: 0, sugar: 0, sodium: 62 },
  'fish': { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 59 },
  'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59 },
  'tuna': { calories: 144, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 43 },
  'shrimp': { calories: 85, protein: 20, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 111 },
  'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124 },
  'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, sugar: 0.6, sodium: 7 },

  // Vegetables
  'tomatoes': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 },
  'onions': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.2, sodium: 4 },
  'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, sugar: 1, sodium: 17 },
  'carrots': { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69 },
  'broccoli': { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, sugar: 1.5, sodium: 33 },
  'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79 },
  'bell peppers': { calories: 31, protein: 1, carbs: 7, fat: 0.3, fiber: 2.5, sugar: 4.2, sodium: 4 },
  'mushrooms': { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, sugar: 2, sodium: 5 },

  // Grains & Starches
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6, sodium: 1 },
  'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5, sodium: 491 },
  'potatoes': { calories: 87, protein: 2, carbs: 20, fat: 0.1, fiber: 1.8, sugar: 0.8, sodium: 6 },
  'quinoa': { calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7 },

  // Dairy
  'cheese': { calories: 113, protein: 25, carbs: 1, fat: 0.2, fiber: 0, sugar: 1, sodium: 381 },
  'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sugar: 5, sodium: 44 },
  'yogurt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.2, sodium: 36 },
  'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, sugar: 0.1, sodium: 11 },

  // Oils & Fats
  'olive oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 2 },
  'coconut oil': { calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 0 },

  // Legumes
  'black beans': { calories: 132, protein: 8.9, carbs: 23, fat: 0.5, fiber: 8.7, sugar: 0.3, sodium: 2 },
  'chickpeas': { calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, sugar: 4.8, sodium: 7 },
  'lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, sugar: 1.8, sodium: 2 }
};

// Standard serving sizes in grams
const SERVING_SIZES = {
  'chicken': 150, 'beef': 120, 'pork': 120, 'fish': 150, 'salmon': 150, 'tuna': 100,
  'shrimp': 100, 'eggs': 50, 'tofu': 100,
  'tomatoes': 150, 'onions': 80, 'garlic': 5, 'carrots': 100, 'broccoli': 100,
  'spinach': 80, 'bell peppers': 120, 'mushrooms': 80,
  'rice': 150, 'pasta': 100, 'bread': 30, 'potatoes': 200, 'quinoa': 150,
  'cheese': 30, 'milk': 240, 'yogurt': 150, 'butter': 14,
  'olive oil': 15, 'coconut oil': 15,
  'black beans': 100, 'chickpeas': 100, 'lentils': 100
};

// Calculate nutrition for entire recipe
export const calculateNutritionForRecipe = (ingredients, servings = 4) => {
  let totalNutrition = {
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0
  };

  ingredients.forEach(ingredient => {
    const nutrition = getIngredientNutrition(ingredient);
    Object.keys(totalNutrition).forEach(key => {
      totalNutrition[key] += nutrition[key];
    });
  });

  // Adjust for servings
  Object.keys(totalNutrition).forEach(key => {
    totalNutrition[key] = Math.round((totalNutrition[key] / servings) * 10) / 10;
  });

  return totalNutrition;
};

// Calculate nutrition when serving size changes
export const calculateNutritionForServings = (recipeNutrition, originalServings, newServings) => {
  const multiplier = newServings / originalServings;
  const adjustedNutrition = {};
  
  Object.keys(recipeNutrition).forEach(key => {
    adjustedNutrition[key] = Math.round(recipeNutrition[key] * multiplier * 10) / 10;
  });

  return adjustedNutrition;
};

// Get nutrition for single ingredient
const getIngredientNutrition = (ingredient) => {
  const normalizedName = normalizeIngredientName(ingredient.name);
  const nutritionData = NUTRITION_DATABASE[normalizedName];
  
  if (!nutritionData) {
    return getDefaultNutrition();
  }

  const amount = parseFloat(ingredient.amount) || 1;
  const gramsAmount = convertToGrams(amount, ingredient.unit, normalizedName);
  const multiplier = gramsAmount / 100; // Database values are per 100g
  
  const nutrition = {};
  Object.keys(nutritionData).forEach(key => {
    nutrition[key] = nutritionData[key] * multiplier;
  });

  return nutrition;
};

// Convert various units to grams
const convertToGrams = (amount, unit, ingredientName) => {
  const unitConversions = {
    // Weight units
    'g': 1, 'grams': 1, 'gram': 1,
    'kg': 1000, 'kilograms': 1000, 'kilogram': 1000,
    'lb': 453.592, 'lbs': 453.592, 'pounds': 453.592, 'pound': 453.592,
    'oz': 28.3495, 'ounces': 28.3495, 'ounce': 28.3495,

    // Volume units (approximate conversions)
    'ml': 1, 'milliliters': 1, 'milliliter': 1,
    'l': 1000, 'liters': 1000, 'liter': 1000,
    'cup': 240, 'cups': 240,
    'tbsp': 15, 'tablespoon': 15, 'tablespoons': 15,
    'tsp': 5, 'teaspoon': 5, 'teaspoons': 5,

    // Count-based units
    'piece': SERVING_SIZES[ingredientName] || 100,
    'pieces': SERVING_SIZES[ingredientName] || 100,
    'whole': SERVING_SIZES[ingredientName] || 100,
    'medium': SERVING_SIZES[ingredientName] || 100,
    'large': (SERVING_SIZES[ingredientName] || 100) * 1.5,
    'small': (SERVING_SIZES[ingredientName] || 100) * 0.7,
    'clove': ingredientName === 'garlic' ? 3 : 5,
    'cloves': ingredientName === 'garlic' ? 3 : 5
  };

  const normalizedUnit = unit ? unit.toLowerCase().trim() : 'piece';
  const conversionFactor = unitConversions[normalizedUnit] || SERVING_SIZES[ingredientName] || 100;

  return amount * conversionFactor;
};

// Normalize ingredient names for lookup
const normalizeIngredientName = (name) => {
  const normalized = name.toLowerCase().trim();
  
  const mappings = {
    'chicken breast': 'chicken', 'chicken thigh': 'chicken', 'chicken meat': 'chicken',
    'ground beef': 'beef', 'beef mince': 'beef', 'steak': 'beef',
    'ground pork': 'pork', 'pork chop': 'pork',
    'cherry tomatoes': 'tomatoes', 'roma tomatoes': 'tomatoes', 'plum tomatoes': 'tomatoes',
    'yellow onion': 'onions', 'red onion': 'onions', 'white onion': 'onions',
    'bell pepper': 'bell peppers', 'sweet pepper': 'bell peppers',
    'white rice': 'rice', 'brown rice': 'rice', 'jasmine rice': 'rice',
    'spaghetti': 'pasta', 'penne': 'pasta', 'fusilli': 'pasta',
    'cheddar cheese': 'cheese', 'mozzarella cheese': 'cheese',
    'whole milk': 'milk', 'skim milk': 'milk',
    'extra virgin olive oil': 'olive oil',
    'canned black beans': 'black beans', 'dried black beans': 'black beans'
  };

  return mappings[normalized] || normalized;
};

// Default nutrition for unknown ingredients
const getDefaultNutrition = () => ({
  calories: 50, protein: 2, carbs: 8, fat: 1, fiber: 2, sugar: 3, sodium: 10
});

// Calculate nutrition score (0-100)
export const calculateNutritionScore = (nutrition) => {
  let score = 50; // Start at neutral

  // Protein bonus (up to +25)
  const proteinRatio = Math.min(nutrition.protein / 25, 1);
  score += proteinRatio * 25;

  // Fiber bonus (up to +15)
  const fiberRatio = Math.min(nutrition.fiber / 10, 1);
  score += fiberRatio * 15;

  // Low sugar bonus (up to +10)
  if (nutrition.sugar < 15) {
    score += (15 - nutrition.sugar) / 15 * 10;
  }

  // High sodium penalty (up to -20)
  if (nutrition.sodium > 800) {
    const penalty = Math.min((nutrition.sodium - 800) / 1200 * 20, 20);
    score -= penalty;
  }

  // Very high calorie penalty (up to -15)
  if (nutrition.calories > 600) {
    const penalty = Math.min((nutrition.calories - 600) / 400 * 15, 15);
    score -= penalty;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

// Get nutritional recommendations
export const getNutritionalRecommendations = (nutrition, servings = 1) => {
  const perServing = calculateNutritionForServings(nutrition, 1, 1/servings);
  const recommendations = [];

  if (perServing.calories < 200) {
    recommendations.push({ type: 'info', message: 'Light meal - consider adding sides' });
  } else if (perServing.calories > 700) {
    recommendations.push({ type: 'warning', message: 'High calorie meal - great for active days' });
  }

  if (perServing.protein > 30) {
    recommendations.push({ type: 'positive', message: 'Excellent protein content!' });
  } else if (perServing.protein < 15) {
    recommendations.push({ type: 'suggestion', message: 'Consider adding protein sources' });
  }

  if (perServing.fiber > 8) {
    recommendations.push({ type: 'positive', message: 'High fiber - great for digestion' });
  }

  if (perServing.sodium > 1200) {
    recommendations.push({ type: 'warning', message: 'High sodium - consider reducing salt' });
  }

  return recommendations;
};

// Format nutrition values for display
export const formatNutritionValue = (value, unit) => {
  if (typeof value !== 'number') return '0' + unit;
  
  if (value < 1) return value.toFixed(1) + unit;
  if (value < 10) return value.toFixed(1) + unit;
  return Math.round(value) + unit;
};

// Daily values for percentage calculations
export const DAILY_VALUES = {
  calories: 2000, protein: 50, carbs: 300, fat: 65, fiber: 25, sodium: 2300
};

export const getNutritionPercentage = (value, nutrient) => {
  const dailyValue = DAILY_VALUES[nutrient];
  if (!dailyValue || !value) return 0;
  return Math.round((value / dailyValue) * 100);
};
