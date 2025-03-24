require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

// Configurazione CORS per accettare richieste dal frontend online e locale
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Connessione a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connesso con successo"))
  .catch(err => console.error("❌ Errore di connessione a MongoDB:", err));

// Modello Utente
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  exercises: [{ 
    name: String, 
    weight: Number, 
    reps: Number, 
    sets: Number,
    date: Date 
  }],
});

const User = mongoose.model("User", UserSchema);

// ✅ REGISTRAZIONE
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    
    if (user) {
      return res.status(400).json({ message: "Utente già esistente" });
    }

    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, password: hashedPassword, exercises: [] });
    await user.save();

    res.status(201).json({ message: "Utente registrato con successo" });
  } catch (err) {
    console.error("❌ Errore nella registrazione:", err);
    res.status(500).json({ message: "Errore server durante la registrazione" });
  }
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

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

// ✅ Aggiungere un esercizio
app.post("/exercise", async (req, res) => {
  try {
    const { username, name, weight, reps, sets } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    user.exercises.push({ name, weight, reps, sets, date: new Date() });
    await user.save();

    res.json({ message: "Esercizio aggiunto con successo!", exercises: user.exercises });
  } catch (err) {
    console.error("❌ Errore durante l'aggiunta dell'esercizio:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

// ✅ Ottenere gli esercizi di un utente
app.get("/exercises/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.json(user.exercises.length > 0 ? user.exercises : []);
  } catch (err) {
    console.error("❌ Errore durante il recupero degli esercizi:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

// ✅ Rimuovere un esercizio
app.delete("/exercise/:username/:exerciseId", async (req, res) => {
  try {
    const { username, exerciseId } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    user.exercises = user.exercises.filter(exercise => exercise._id.toString() !== exerciseId);
    await user.save();

    res.json({ message: "Esercizio rimosso con successo", exercises: user.exercises });
  } catch (err) {
    console.error("❌ Errore durante la rimozione dell'esercizio:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

// ✅ Avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server in ascolto sulla porta ${PORT}`));
