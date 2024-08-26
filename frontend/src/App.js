import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Callback from './pages/Callback'; // Asegúrate de crear este componente
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} /> {/* Ruta para el callback */}
      </Routes>
    </>
  );
};

export default App;
