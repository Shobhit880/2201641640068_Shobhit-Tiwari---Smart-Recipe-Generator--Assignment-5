// Mock API service for external integrations
const API_CONFIG = {
  IMAGE_RECOGNITION_URL: process.env.REACT_APP_IMAGE_RECOGNITION_API || 'https://api.example.com/recognize-food',
  NUTRITION_API_URL: process.env.REACT_APP_NUTRITION_API || 'https://api.example.com/nutrition',
  RECIPE_API_URL: process.env.REACT_APP_RECIPE_API || 'https://api.example.com/recipes',
  API_KEY: process.env.REACT_APP_API_KEY || 'demo-key',
  TIMEOUT: 10000
};

// Simulate API delay for realistic UX
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API call wrapper with error handling
export const apiCall = async (apiFunction, ...args) => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), API_CONFIG.TIMEOUT);
    });
    
    const result = await Promise.race([apiFunction(...args), timeoutPromise]);
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    
    if (error.message.includes('timeout')) {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    
    if (error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw new Error('Service temporarily unavailable. Please try again later.');
  }
};

// Image recognition API call (mock implementation)
export const callImageRecognitionAPI = async (imageFile) => {
  await delay(2000); // Simulate processing time
  
  try {
    // In a real implementation, you would upload the file to an AI service
    // For demo purposes, we'll return mock data
    const mockIngredients = [
      'chicken', 'rice', 'onions', 'garlic', 'tomatoes',
      'carrots', 'potatoes', 'broccoli', 'cheese', 'eggs',
      'bell peppers', 'mushrooms', 'spinach', 'pasta', 'ground beef',
      'milk', 'butter', 'olive oil', 'herbs', 'spices'
    ];
    
    // Return 2-5 random ingredients with confidence scores
    const numIngredients = Math.floor(Math.random() * 4) + 2;
    const selectedIngredients = [];
    
    for (let i = 0; i < numIngredients; i++) {
      const randomIndex = Math.floor(Math.random() * mockIngredients.length);
      const ingredient = mockIngredients[randomIndex];
      
      if (!selectedIngredients.includes(ingredient)) {
        selectedIngredients.push(ingredient);
      }
    }
    
    return {
      success: true,
      ingredients: selectedIngredients,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      processingTime: 1800,
      detectedObjects: selectedIngredients.length,
      apiUsage: {
        requestId: `req_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to process image',
      code: 'PROCESSING_ERROR'
    };
  }
};

export const fetchNutritionData = async (ingredients, servings = 1) => {
  await delay(1000);
  
  try {
    
    const baseNutrition = ingredients.reduce((acc, ingredient) => {
      const mockValues = {
        calories: Math.floor(Math.random() * 100) + 50,
        protein: Math.floor(Math.random() * 15) + 5,
        carbs: Math.floor(Math.random() * 20) + 10,
        fat: Math.floor(Math.random() * 10) + 2,
        fiber: Math.floor(Math.random() * 5) + 1,
        sugar: Math.floor(Math.random() * 8) + 2,
        sodium: Math.floor(Math.random() * 200) + 100
      };
      
      Object.keys(mockValues).forEach(key => {
        acc[key] = (acc[key] || 0) + mockValues[key];
      });
      
      return acc;
    }, {});
    
    return Object.keys(baseNutrition).reduce((adjusted, key) => {
      adjusted[key] = Math.round(baseNutrition[key] * servings);
      return adjusted;
    }, {});
    
  } catch (error) {
    throw new Error('Failed to calculate nutrition data');
  }
};


export const fetchRecipeSuggestions = async (ingredients, filters = {}, limit = 20) => {
  await delay(1200);
  
  try {
    return {
      success: true,
      recipes: [],
      totalResults: 0,
      apiUsage: {
        requestId: `req_${Date.now()}`,
        creditsUsed: 1,
        remainingCredits: 99
      }
    };
  } catch (error) {
    return {
      success: false,
      recipes: [],
      error: 'Failed to fetch external recipes'
    };
  }
};

export const checkAPIHealth = async () => {
  try {
    const checks = await Promise.allSettled([
      Promise.resolve({ service: 'image-recognition', status: 'healthy' }),
      Promise.resolve({ service: 'nutrition-api', status: 'healthy' }),
      Promise.resolve({ service: 'recipe-api', status: 'healthy' })
    ]);
    
    return {
      timestamp: new Date().toISOString(),
      services: checks.map(check => 
        check.status === 'fulfilled' 
          ? check.value 
          : { service: 'unknown', status: 'error', error: check.reason.message }
      )
    };
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      services: []
    };
  }
};

class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return this.requests.length < this.maxRequests;
  }
  
  recordRequest() {
    if (this.canMakeRequest()) {
      this.requests.push(Date.now());
      return true;
    }
    return false;
  }
}

export const rateLimiter = new RateLimiter();

export { API_CONFIG };
