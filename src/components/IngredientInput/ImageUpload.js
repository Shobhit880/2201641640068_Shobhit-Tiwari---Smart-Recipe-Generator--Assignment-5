import React, { useState, useRef } from 'react';
import { recognizeIngredientsFromImage } from '../../services/imageRecognition';

const ImageUpload = ({ onClose, onIngredientsDetected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image file is too large. Please select an image under 10MB');
      return;
    }

    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
    setIsLoading(true);

    try {
      const ingredients = await recognizeIngredientsFromImage(file);
      setDetectedIngredients(ingredients);
    } catch (err) {
      setError(err.message || 'Failed to recognize ingredients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (detectedIngredients.length > 0) {
      onIngredientsDetected(detectedIngredients);
      onClose();
    }
  };

  const handleRetry = () => {
    setPreviewUrl(null);
    setDetectedIngredients([]);
    setError(null);
    fileInputRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const event = { target: { files: [imageFile] } };
      handleFileSelect(event);
    }
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    modal: {
      background: 'white',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    title: {
      margin: 0,
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#111827'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px',
      borderRadius: '4px',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    body: {
      padding: '24px'
    },
    uploadArea: {
      border: '2px dashed #d1d5db',
      borderRadius: '12px',
      padding: '40px 20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: '#f9fafb',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    uploadAreaHover: {
      borderColor: '#667eea',
      backgroundColor: '#f0f4ff'
    },
    uploadIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      color: '#6b7280'
    },
    uploadText: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    uploadSubtext: {
      fontSize: '14px',
      color: '#6b7280'
    },
    previewImage: {
      maxWidth: '100%',
      maxHeight: '300px',
      objectFit: 'contain',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px'
    },
    ingredientsList: {
      backgroundColor: '#f0fdf4',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    ingredientsTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#065f46',
      marginBottom: '12px'
    },
    ingredientTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px'
    },
    ingredientTag: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500'
    },
    actions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none'
    },
    primaryButton: {
      backgroundColor: '#667eea',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    hiddenInput: {
      display: 'none'
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h3 style={modalStyles.title}>Upload Ingredient Photo</h3>
          <button onClick={onClose} style={modalStyles.closeButton}>
            ×
          </button>
        </div>
        
        <div style={modalStyles.body}>
          {error && (
            <div style={modalStyles.error}>
              {error}
            </div>
          )}
          
          <div
            style={{
              ...modalStyles.uploadArea,
              ...(isLoading ? {} : modalStyles.uploadAreaHover)
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !isLoading && fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" style={modalStyles.previewImage} />
            ) : (
              <>
                <div style={modalStyles.uploadIcon}>📷</div>
                <p style={modalStyles.uploadText}>Click to select or drag & drop an image</p>
                <small style={modalStyles.uploadSubtext}>Supported formats: JPG, PNG, WebP (Max 10MB)</small>
              </>
            )}
            
            {isLoading && (
              <div style={modalStyles.loadingOverlay}>
                <div style={modalStyles.spinner}></div>
                <p style={{ margin: 0, color: '#374151', fontSize: '16px' }}>
                  Analyzing ingredients...
                </p>
              </div>
            )}
          </div>
          
          {detectedIngredients.length > 0 && (
            <div style={modalStyles.ingredientsList}>
              <h4 style={modalStyles.ingredientsTitle}>
                Detected Ingredients ({detectedIngredients.length})
              </h4>
              <div style={modalStyles.ingredientTags}>
                {detectedIngredients.map((ingredient, index) => (
                  <span key={index} style={modalStyles.ingredientTag}>
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div style={modalStyles.actions}>
            {detectedIngredients.length > 0 ? (
              <>
                <button
                  onClick={handleRetry}
                  style={{...modalStyles.button, ...modalStyles.secondaryButton}}
                >
                  Try Another Photo
                </button>
                <button
                  onClick={handleConfirm}
                  style={{...modalStyles.button, ...modalStyles.primaryButton}}
                >
                  Add These Ingredients
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                style={{...modalStyles.button, ...modalStyles.secondaryButton}}
              >
                Cancel
              </button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={modalStyles.hiddenInput}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
