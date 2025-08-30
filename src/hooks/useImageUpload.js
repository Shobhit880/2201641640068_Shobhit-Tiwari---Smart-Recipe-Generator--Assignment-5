import { useState, useCallback } from 'react';
import { recognizeIngredientsFromImage } from '../services/imageRecognition';

export const useImageUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadImage = useCallback(async (file, onSuccess, onError) => {
    if (!file) {
      setError('No file provided');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Image file is too large. Please select an image under 10MB');
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Process image
      const result = await recognizeIngredientsFromImage(file);

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        onSuccess?.(result.ingredients);
      } else {
        throw new Error(result.error || 'Failed to process image');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload and process image';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setProgress(0);
  }, []);

  return {
    uploadImage,
    isLoading,
    error,
    progress,
    reset
  };
};
