import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/mainpage/home';
import LoginPage from './features/auth/pages/loginform';
import { RIMSDashboard } from './features/Dashboard/main';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<RIMSDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
