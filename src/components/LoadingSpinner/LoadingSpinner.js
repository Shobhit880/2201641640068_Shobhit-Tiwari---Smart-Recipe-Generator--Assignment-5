import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Finding perfect recipes for you..." }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner-container">
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="spinner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="loading-content">
        <h3 className="loading-title">{message}</h3>
        <p className="loading-subtitle">Analyzing ingredients and matching recipes</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
