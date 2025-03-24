import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config"; // Importa API_BASE_URL dal file di configurazione
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Reset messaggio di errore quando l'utente cambia input
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setMessage("");
  };

  // Funzione per la registrazione
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    const sanitizedUsername = username.trim().toLowerCase();
    
    if (!sanitizedUsername) {
      setMessage("⚠️ Inserisci un username valido!");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Le password non coincidono!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, { // ✅ Usa API_BASE_URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: sanitizedUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Registrazione completata! Reindirizzamento in corso...");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setAcceptedPrivacy(false);

        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      setMessage("❌ Errore di connessione. Riprova.");
    }
  };

  return (
    <div className="register-container">
      <h1 className="site-title">GymProgress</h1>
      <h3 className="site-subtitle">Registra i tuoi risultati</h3>

      <div className="register-box">
        <h2>Registrazione</h2>

        {message && <p className="error-message">{message}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Scegli un username"
            value={username}
            onChange={handleInputChange(setUsername)}
            required
          />
          <input
            type="password"
            placeholder="Scegli una password"
            value={password}
            onChange={handleInputChange(setPassword)}
            required
          />
          <input
            type="password"
            placeholder="Conferma password"
            value={confirmPassword}
            onChange={handleInputChange(setConfirmPassword)}
            required
          />

          {/* Checkbox Privacy */}
          <div className="privacy-container">
            <label className="privacy-label">
              <input
                type="checkbox"
                id="privacyPolicy"
                checked={acceptedPrivacy}
                onChange={() => setAcceptedPrivacy(!acceptedPrivacy)}
                required
              />
              <span>
                Ho più di 13 anni, ho letto e accetto l'
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Informativa sulla Privacy
                </a>
              </span>
            </label>
          </div>

          {/* Pulsante Registrati */}
          <button type="submit" disabled={!acceptedPrivacy}>
            Registrati
          </button>
        </form>

        <p className="login-link">
          Hai già un account?{" "}
          <span onClick={() => navigate("/login")}>Accedi qui</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
