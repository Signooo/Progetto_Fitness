import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExerciseForm from "./ExerciseForm";
import "./ExercisePage.css";

const ExercisePage = () => {
  const { username } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Recupera gli esercizi dell'utente
  const fetchExercises = async () => {
    try {
      const response = await fetch(`http://localhost:5000/exercises/${username}`);
      const data = await response.json();

      if (response.ok) {
        setExercises(data);
      } else {
        setErrorMessage(`Errore: ${data.message}`);
      }
    } catch (error) {
      console.error("Errore nel recupero degli esercizi:", error);
      setErrorMessage("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  // Rimuove un esercizio
  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo esercizio?")) return;

    try {
      const response = await fetch(`http://localhost:5000/exercise/${username}/${exerciseId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Esercizio rimosso con successo!");
        fetchExercises();
      } else {
        alert(`Errore: ${data?.message || "Errore sconosciuto"}`);
      }
    } catch (error) {
      console.error("Errore durante la rimozione dell'esercizio:", error);
      alert("Errore durante la rimozione dell'esercizio.");
    }
  };

  // Funzione Logout
  const handleLogout = () => {
    if (!window.confirm("Vuoi davvero effettuare il logout?")) return;

    localStorage.removeItem("user"); // 🔹 Pulisce i dati salvati
    navigate("/"); // 🔹 Riporta al login
  };

  // Carica gli esercizi al montaggio
  useEffect(() => {
    fetchExercises();
  }, [username]);

  return (
    <div className="exercise-page">
      {/* Pulsante di Logout */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <h2>Esercizi di {username}</h2>

      {/* Messaggi di errore */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Form per aggiungere esercizi */}
      <ExerciseForm username={username} fetchExercises={fetchExercises} />

      {/* Tabella degli esercizi */}
      {loading ? (
        <p>Caricamento in corso...</p>
      ) : exercises.length === 0 ? (
        <p>Nessun esercizio registrato.</p>
      ) : (
        <div className="exercise-table-container">
          <table className="exercise-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Peso (kg)</th>
                <th>Ripetizioni</th>
                <th>Serie</th>
                <th>Data</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((exercise) => (
                <tr key={exercise._id}>
                  <td>{exercise.name}</td>
                  <td>{exercise.weight}</td>
                  <td>{exercise.reps}</td>
                  <td>{exercise.sets}</td>
                  <td>{new Date(exercise.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteExercise(exercise._id)}
                    >
                      Rimuovi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
