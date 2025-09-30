import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Aquí definiremos las rutas públicas y protegidas más adelante */}
        <Route path="/" element={<div>Página de Inicio (Temporal)</div>} />
        <Route path="/login" element={<div>Página de Login (Temporal)</div>} />
      </Routes>
    </Router>
  );
}

export default App;