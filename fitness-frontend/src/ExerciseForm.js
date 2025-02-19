import { useState } from "react";

const ExerciseForm = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const handleAddExercise = async () => {
    const response = await fetch("http://localhost:5000/exercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, weight, reps }),
    });

    const data = await response.json();
    console.log("Esercizio aggiunto:", data);
    alert(`Esercizio "${name}" aggiunto per ${username}!`);
  };

  return (
    <div>
      <h2>Aggiungi Esercizio</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nome esercizio"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Peso (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <input
        type="number"
        placeholder="Ripetizioni"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <button onClick={handleAddExercise}>Aggiungi</button>
    </div>
  );
};

export default ExerciseForm;
