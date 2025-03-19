// src/components/ExerciseList.js
import { useEffect, useState } from "react";

const ExerciseList = ({ username }) => {
  const [exercises, setExercises] = useState([]);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`http://localhost:5000/exercises/${username}`);
      const data = await response.json();

      if (response.ok) {
        setExercises(data);
      } else {
        alert(`❌ Errore: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Errore nel recupero degli esercizi:", error);
      alert("❌ Errore del server. Riprova più tardi.");
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [username]);

  return (
    <div>
      <h3>Storico Esercizi</h3>
      {exercises.length === 0 ? (
        <p>Nessun esercizio registrato.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Peso (kg)</th>
              <th>Ripetizioni</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((ex, index) => (
              <tr key={index}>
                <td>{ex.name}</td>
                <td>{ex.weight}</td>
                <td>{ex.reps}</td>
                <td>{new Date(ex.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExerciseList;
