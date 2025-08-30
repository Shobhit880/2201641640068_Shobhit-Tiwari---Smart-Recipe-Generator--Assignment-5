const MOCK_INGREDIENTS_DATABASE = [
  'chicken', 'beef', 'pork', 'fish', 'eggs', 'milk', 'cheese', 'butter',
  'rice', 'pasta', 'bread', 'potatoes', 'onions', 'garlic', 'tomatoes',
  'carrots', 'broccoli', 'spinach', 'bell peppers', 'mushrooms',
  'olive oil', 'salt', 'pepper', 'herbs', 'spices', 'lemon', 'lime'
];

export const recognizeIngredientsFromImage = async (imageFile) => {
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    
    const mockDetectedIngredients = generateMockIngredients();
    
    return {
      success: true,
      ingredients: mockDetectedIngredients,
      confidence: Math.random() * 0.3 + 0.7 
    };
  } catch (error) {
    throw new Error('Failed to analyze image. Please try again.');
  }
};

const generateMockIngredients = () => {

  const count = Math.floor(Math.random() * 4) + 2;
  const shuffled = [...MOCK_INGREDIENTS_DATABASE].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Please upload a valid image file (JPG, PNG, or WebP)');
  }

  if (file.size > maxSize) {
    throw new Error('Image file is too large. Please select an image under 10MB');
  }

  return true;
};
