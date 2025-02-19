import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");

  const handleRegister = async () => {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    console.log("Utente registrato:", data);
    alert(`Utente ${data.username} registrato con successo!`);
  };

  return (
    <div>
      <h2>Registrazione Utente</h2>
      <input
        type="text"
        placeholder="Inserisci username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleRegister}>Registrati</button>
    </div>
  );
};

export default Register;
