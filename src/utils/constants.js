// Application constants and configuration

export const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Low-Carb',
  'High-Protein',
  'Mediterranean',
  'Whole30',
  'Pescatarian',
  'Nut-Free'
];

export const DIFFICULTY_OPTIONS = [
  'Easy',
  'Medium',
  'Hard'
];

export const CUISINE_OPTIONS = [
  'Italian',
  'Mexican',
  'Asian',
  'Indian',
  'Mediterranean',
  'American',
  'French',
  'Thai',
  'Japanese',
  'Chinese',
  'Greek',
  'Spanish',
  'Middle Eastern',
  'Korean',
  'Vietnamese',
  'Brazilian',
  'Ethiopian',
  'Turkish',
  'Moroccan'
];

export const COOKING_TIME_OPTIONS = [
  { label: '15 min or less', value: 15 },
  { label: '30 min or less', value: 30 },
  { label: '45 min or less', value: 45 },
  { label: '1 hour or less', value: 60 },
  { label: '2 hours or less', value: 120 }
];

export const SERVING_SIZE_OPTIONS = [
  { label: '1 person', value: 1 },
  { label: '2 people', value: 2 },
  { label: '4 people', value: 4 },
  { label: '6 people', value: 6 },
  { label: '8 people', value: 8 }
];

export const MEASUREMENT_UNITS = [
  'cups', 'cup', 'tbsp', 'tablespoon', 'tablespoons',
  'tsp', 'teaspoon', 'teaspoons', 'oz', 'ounce', 'ounces',
  'lb', 'lbs', 'pound', 'pounds', 'g', 'grams', 'gram',
  'kg', 'kilograms', 'kilogram', 'ml', 'milliliters', 'milliliter',
  'l', 'liters', 'liter', 'pieces', 'piece', 'cloves', 'clove',
  'slices', 'slice', 'whole', 'medium', 'large', 'small'
];

export const COMMON_INGREDIENTS = [
  'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'eggs', 'tofu',
  'rice', 'pasta', 'bread', 'potatoes', 'quinoa', 'noodles',
  'onions', 'garlic', 'tomatoes', 'bell peppers', 'carrots',
  'broccoli', 'spinach', 'mushrooms', 'zucchini', 'corn', 'lettuce',
  'cheese', 'milk', 'butter', 'yogurt', 'cream', 'sour cream',
  'olive oil', 'vegetable oil', 'coconut oil', 'salt', 'pepper',
  'herbs', 'spices', 'basil', 'oregano', 'thyme', 'rosemary',
  'lemon', 'lime', 'ginger', 'chili', 'avocado'
];

export const RECIPE_CATEGORIES = [
  'Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snack', 'Appetizer',
  'Main Course', 'Side Dish', 'Dessert', 'Soup', 'Salad',
  'Beverage', 'Smoothie', 'Sauce', 'Dressing'
];

export const ALLERGENS = [
  'Nuts', 'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Gluten', 'Wheat',
  'Soy', 'Shellfish', 'Fish', 'Sesame', 'Sulfites'
];

export const COOKING_METHODS = [
  'Baking', 'Roasting', 'Grilling', 'Frying', 'Sautéing', 'Boiling',
  'Steaming', 'Poaching', 'Braising', 'Stewing', 'Slow Cooking',
  'Pressure Cooking', 'Air Frying', 'Smoking', 'Raw/No Cook'
];

export const EQUIPMENT_NEEDED = [
  'Oven', 'Stovetop', 'Microwave', 'Grill', 'Slow Cooker',
  'Pressure Cooker', 'Air Fryer', 'Food Processor', 'Blender',
  'Stand Mixer', 'Hand Mixer', 'No Special Equipment'
];

// UI Constants
export const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#48bb78',
  warning: '#ed8936',
  error: '#e53e3e',
  info: '#3182ce',
  light: '#f7fafc',
  dark: '#2d3748',
  gray: {
    50: '#f7fafc',
    100: '#edf2f7',
    200: '#e2e8f0',
    300: '#cbd5e0',
    400: '#a0aec0',
    500: '#718096',
    600: '#4a5568',
    700: '#2d3748',
    800: '#1a202c',
    900: '#171923'
  }
};

export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  large: '1200px',
  xlarge: '1440px'
};

// API Constants
export const API_ENDPOINTS = {
  IMAGE_RECOGNITION: '/api/recognize-ingredients',
  RECIPES: '/api/recipes',
  NUTRITION: '/api/nutrition',
  USER_PREFERENCES: '/api/user/preferences',
  RECIPE_SUGGESTIONS: '/api/suggestions'
};

// Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: 'recipe-favorites',
  RATINGS: 'recipe-ratings',
  PREFERENCES: 'user-preferences',
  SEARCH_HISTORY: 'search-history',
  RECENT_INGREDIENTS: 'recent-ingredients',
  THEME: 'app-theme',
  LANGUAGE: 'app-language'
};

// Default Values
export const DEFAULT_VALUES = {
  SERVING_SIZE: 4,
  MAX_RECIPES_DISPLAY: 24,
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  SEARCH_DEBOUNCE_MS: 300,
  API_TIMEOUT_MS: 10000,
  MIN_MATCH_PERCENTAGE: 10,
  SUGGESTIONS_COUNT: 12
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  IMAGE_TOO_LARGE: 'Image file is too large. Please select an image under 10MB.',
  INVALID_IMAGE: 'Please select a valid image file (JPG, PNG, or WebP).',
  NO_RECIPES_FOUND: 'No recipes found matching your criteria. Try adjusting your filters.',
  INGREDIENT_RECOGNITION_FAILED: 'Failed to recognize ingredients. Please try with a clearer image.',
  GENERIC_ERROR: 'Something went wrong. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please check your connection.',
  INVALID_INPUT: 'Invalid input. Please check your data and try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  RECIPE_SAVED: 'Recipe saved to favorites!',
  RECIPE_REMOVED: 'Recipe removed from favorites.',
  RATING_SAVED: 'Rating saved successfully!',
  INGREDIENTS_DETECTED: 'Ingredients detected from image!',
  PREFERENCES_SAVED: 'Preferences saved successfully!',
  RECIPE_SHARED: 'Recipe shared successfully!'
};

// Feature Flags
export const FEATURES = {
  IMAGE_RECOGNITION: true,
  USER_ACCOUNTS: false,
  RECIPE_SHARING: true,
  OFFLINE_MODE: false,
  ADVANCED_FILTERS: true,
  NUTRITION_TRACKING: true,
  MEAL_PLANNING: false,
  SHOPPING_LISTS: true,
  RECIPE_SCALING: true
};

// Recipe Validation Rules
export const VALIDATION_RULES = {
  RECIPE_NAME_MIN_LENGTH: 3,
  RECIPE_NAME_MAX_LENGTH: 100,
  MIN_INGREDIENTS: 2,
  MAX_INGREDIENTS: 30,
  MIN_INSTRUCTIONS: 2,
  MAX_INSTRUCTIONS: 20,
  MAX_COOKING_TIME: 480, // 8 hours
  MIN_SERVINGS: 1,
  MAX_SERVINGS: 20,
  MIN_CALORIES: 50,
  MAX_CALORIES: 2000
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'Smart Recipe Generator',
  VERSION: '1.0.0',
  DESCRIPTION: 'Discover amazing recipes from your ingredients using AI',
  AUTHOR: 'Recipe Generator Team',
  CONTACT_EMAIL: 'support@recipeGenerator.com',
  SOCIAL_LINKS: {
    GITHUB: 'https://github.com/recipe-generator',
    TWITTER: 'https://twitter.com/recipeGenerator',
    INSTAGRAM: 'https://instagram.com/recipeGenerator'
  }
};

// Performance Constants
export const PERFORMANCE = {
  LAZY_LOAD_THRESHOLD: '100px',
  IMAGE_COMPRESSION_QUALITY: 0.8,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100
};

export default {
  DIETARY_OPTIONS,
  DIFFICULTY_OPTIONS,
  CUISINE_OPTIONS,
  COMMON_INGREDIENTS,
  COLORS,
  BREAKPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_VALUES,
  FEATURES,
  APP_CONFIG
};
