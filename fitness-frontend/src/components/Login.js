import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config"; // Importa il file di configurazione
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const sanitizedUsername = username.trim().toLowerCase();

    if (!sanitizedUsername || !password) {
      setErrorMessage("⚠️ Inserisci username e password!");
      return;
    }

    setErrorMessage(""); 

    try {
      const response = await fetch(`${API_BASE_URL}/login`, { // ✅ Usa API_BASE_URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: sanitizedUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/exercises/${data.user.username}`);
      } else {
        setErrorMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
      setErrorMessage("❌ Errore di connessione. Riprova.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="site-title">GymProgress</h1>
      <h3 className="site-subtitle">Registra i tuoi risultati</h3>

      <div className="login-box">
        <h2>Login</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Accedi</button>

        <p className="register-link">
          Non hai un account? <span onClick={() => navigate("/register")}>Registrati qui</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
