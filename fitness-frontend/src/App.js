import Register from "./Register";
import ExerciseForm from "./ExerciseForm";
import './App.css'; // Assicurati di importare il file CSS dove applicherai le modifiche

function App() {
  return (
    <div className="App">
      <h1>Fitness App</h1>
      <Register />
      <ExerciseForm />
    </div>
  );
}

export default App;
