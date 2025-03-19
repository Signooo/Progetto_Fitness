import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ExercisePage from "./components/ExercisePage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />  {/* Login è la homepage */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />  {/* Assicurati che questa esista */}
        <Route path="/exercises/:username" element={<ExercisePage />} />
      </Routes>
    </div>
  );
}

export default App;
