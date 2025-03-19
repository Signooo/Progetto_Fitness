import { useState, useRef, useEffect } from "react";
import "./ExerciseForm.css"; // Importiamo il CSS per lo stile

const ExerciseForm = ({ username, fetchExercises }) => {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState(""); // 👈 Stato per il numero di serie
  const [errorMessage, setErrorMessage] = useState(""); // Stato per il messaggio di errore
  const nameRef = useRef(null); // Ref per riportare il focus al primo input

  useEffect(() => {
    if (!name) {
      nameRef.current?.focus(); // Torna al primo input se vuoto
    }
  }, [name]);

  const handleAddExercise = async () => {
    // Controllo se tutti i campi sono compilati (rimuovendo spazi inutili)
    if (!name.trim() || !weight.toString().trim() || !reps.toString().trim() || !sets.toString().trim()) {
      setErrorMessage("⚠️ Per favore, completa tutti i campi!");
      return;
    }

    const weightValue = Number(weight);
    const repsValue = Number(reps);
    const setsValue = Number(sets); // 👈 Convertito in numero

    if (weightValue < 1 || weightValue > 300) {
      setErrorMessage("⚠️ Il peso deve essere tra 1 e 300 kg!");
      return;
    }
    if (repsValue < 1 || repsValue > 100) {
      setErrorMessage("⚠️ Le ripetizioni devono essere tra 1 e 100!");
      return;
    }
    if (setsValue < 1 || setsValue > 10) { // 👈 Validazione del numero di serie
      setErrorMessage("⚠️ Le serie devono essere tra 1 e 10!");
      return;
    }

    // Reset del messaggio di errore se tutto è compilato correttamente
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, weight: weightValue, reps: repsValue, sets: setsValue }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Esercizio aggiunto con successo!");
        fetchExercises(); // Aggiorna la lista degli esercizi
        // Reset dei campi
        setName("");
        setWeight("");
        setReps("");
        setSets("");
        nameRef.current?.focus(); // Riporta il focus al primo input
      } else {
        alert(`❌ Errore: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Errore durante l'aggiunta dell'esercizio:", error);
      alert("❌ Errore durante l'aggiunta dell'esercizio.");
    }
  };

  return (
    <div className="exercise-form">
      <h3>Aggiungi Esercizio</h3>
      {/* Mostra il messaggio di errore se c'è un problema */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <select ref={nameRef} value={name} onChange={(e) => setName(e.target.value)}>
  <option value="">Seleziona esercizio</option>
  <option value="Squat">Squat</option>
  <option value="Affondi con Bilanciere">Affondi con Bilanciere</option>
  <option value="Affondi con Manubri">Affondi con Manubri</option>
  <option value="Pressa">Pressa</option>
  <option value="Pressa Monopodalica">Pressa Monopodalica</option>
  <option value="Leg Extension">Leg Extension</option>
  <option value="Stacco da Terra">Stacco da Terra</option>
  <option value="Stacco Rumeno">Stacco Rumeno</option>
  <option value="Standing Gluteus">Standing Gluteus</option>
  <option value="Panca Romana">Panca Romana</option>
  <option value="Panca Piana">Panca Piana</option>
  <option value="Panca Piana con Manubri">Panca Piana con Manubri</option>
  <option value="Push Press">Push Press</option>
  <option value="Shoulder Press da Seduti">Shoulder Press da Seduti</option>
  <option value="Rematore con Manubrio">Rematore con Manubrio</option>
  <option value="Rematore con Bilanciere">Rematore con Bilanciere</option>
  <option value="Lat Machine">Lat Machine</option>
  <option value="Pulley Basso">Pulley Basso</option>
  <option value="Peck Deck">Peck Deck</option>
  <option value="Pectoral Machine">Pectoral Machine</option>
  <option value="Curl con Manubri">Curl con Manubri</option>
  <option value="Curl con Bilanciere">Curl con Bilanciere</option>
  <option value="Alzate Laterali">Alzate Laterali</option>
  <option value="Pull Over">Pull Over</option>
  <option value="Trazioni">Trazioni</option>
  <option value="Trazioni con Elastico">Trazioni con Elastico</option>
  <option value="French Press con Bilanciere">French Press con Bilanciere</option>
  <option value="French Press con Manubri">French Press con Manubri</option>
  <option value="Tricipiti all'Ercolina">Tricipiti all'Ercolina</option>
</select>


      <input
        type="number"
        placeholder="Peso (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        min="1"
        max="200"
        required
      />

      <input
        type="number"
        placeholder="Ripetizioni"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        min="1"
        max="12"
        required
      />

      <input
        type="number"
        placeholder="Serie" // 👈 Nuovo campo per le serie
        value={sets}
        onChange={(e) => setSets(e.target.value)}
        min="1"
        max="5"
        required
      />

      <button onClick={handleAddExercise}>Aggiungi</button>
    </div>
  );
};

export default ExerciseForm;
