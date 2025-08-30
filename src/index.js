import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RecipeProvider } from './context/RecipeContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserPreferencesProvider>
      <RecipeProvider>
        <App />
      </RecipeProvider>
    </UserPreferencesProvider>
  </React.StrictMode>
);
