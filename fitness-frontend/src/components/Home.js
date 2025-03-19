import React from "react";
import Register from "./Register";
import Login from "./Login";

const Home = () => {
  return (
    <div>
      <h2>Benvenuto! Effettua il login o registrati</h2>
      <Login />
      <Register />
    </div>
  );
};

export default Home;
