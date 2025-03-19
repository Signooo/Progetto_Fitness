import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom'; // Aggiungi il Router qui

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Avvolgi tutta l'app con il Router */}
      <App />
    </Router>
  </React.StrictMode>
);

reportWebVitals();
