import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Importar Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importar nuestros estilos personalizados (deben ir después de Bootstrap)
import './assets/css/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);