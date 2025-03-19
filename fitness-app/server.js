require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Importa bcrypt per criptare le password

const app = express();

// Configurazione di CORS
const corsOptions = {
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connesso con successo"))
  .catch(err => console.error("❌ Errore di connessione a MongoDB:", err));

// Modello Utente con PASSWORD e SERIE
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Aggiunto il campo password
  exercises: [{ 
    name: String, 
    weight: Number, 
    reps: Number, 
    sets: Number, // 👈 Aggiunto il campo "Serie"
    date: Date 
  }],
});

const User = mongoose.model("User", UserSchema);

// ✅ REGISTRAZIONE con password criptata
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    
    if (user) {
      return res.status(400).json({ message: "Utente già esistente" });
    }

    // Cripta la password prima di salvarla
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ username, password: hashedPassword, exercises: [] });
    await user.save();

    res.status(201).json({ message: "Utente registrato con successo" });
  } catch (err) {
    console.error("❌ Errore nella registrazione:", err);
    res.status(500).json({ message: "Errore server durante la registrazione" });
  }
});

// ✅ LOGIN con verifica password
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Confronta la password inserita con quella criptata nel database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password errata" });
    }

    res.status(200).json({ message: "Login riuscito", user });
  } catch (err) {
    console.error("❌ Errore durante il login:", err);
    res.status(500).json({ message: "Errore server durante il login" });
  }
});

// ✅ Endpoint per aggiungere esercizi con serie
app.post("/exercise", async (req, res) => {
  try {
    const { username, name, weight, reps, sets } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    user.exercises.push({ name, weight, reps, sets, date: new Date() }); // 👈 Aggiunto "sets"
    await user.save();

    res.json({ message: "Esercizio aggiunto con successo!", exercises: user.exercises });
  } catch (err) {
    console.error("❌ Errore durante l'aggiunta dell'esercizio:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

// ✅ Endpoint per ottenere gli esercizi di un utente
app.get("/exercises/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.json(user.exercises.length > 0 ? user.exercises : []); // Evita errore se non ci sono esercizi
  } catch (err) {
    console.error("❌ Errore durante il recupero degli esercizi:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

// ✅ Endpoint per rimuovere un esercizio
app.delete("/exercise/:username/:exerciseId", async (req, res) => {
  try {
    const { username, exerciseId } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Filtra e rimuovi l'esercizio con l'ID specificato
    user.exercises = user.exercises.filter(exercise => exercise._id.toString() !== exerciseId);
    await user.save();

    res.json({ message: "Esercizio rimosso con successo", exercises: user.exercises });
  } catch (err) {
    console.error("❌ Errore durante la rimozione dell'esercizio:", err);
    res.status(500).json({ message: "Errore del server durante la rimozione dell'esercizio" });
  }
});

// Avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server in ascolto sulla porta ${PORT}`));
