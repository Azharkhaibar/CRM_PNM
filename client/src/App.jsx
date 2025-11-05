import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Mainpage from "./pages/mainpage/home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Mainpage />} />


      </Routes>
    </div>
  );
}

export default App;
