import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Mainpage from "./pages/mainpage/home";
import Login from "./pages/mainpage/formlogin";
import bg from "./assets/pnm_background.jpeg";

function App() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Routes>
    
        <Route path="/formlogin" element={<Login />} />
        <Route path="/" element={<Mainpage />} />


      </Routes>
    </div>
  );
}

export default App;
