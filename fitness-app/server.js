require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connesso con successo"))
.catch(err => console.error("❌ Errore di connessione a MongoDB:", err));

// Modello Utente
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    exercises: [{ name: String, weight: Number, reps: Number, date: Date }]
});

const User = mongoose.model("User", UserSchema);

// Creazione utente
app.post("/register", async (req, res) => {
    try {
        const { username } = req.body;
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username, exercises: [] });
            await user.save();
            res.status(201).json({ message: "Utente registrato con successo", user });
        } else {
            res.status(400).json({ message: "Utente già esistente" });
        }
    } catch (err) {
        console.error("Errore nella registrazione:", err);
        res.status(500).json({ message: "Errore server durante la registrazione" });
    }
});

app.post("/exercise", async (req, res) => {
    try {
        const { username, name, weight, reps } = req.body;
        const user = await User.findOne({ username });
        if (user) {
            user.exercises.push({ name, weight, reps, date: new Date() });
            await user.save();
            res.json({ message: "Esercizio aggiunto", user });
        } else {
            res.status(404).json({ message: "Utente non trovato" });
        }
    } catch (err) {
        console.error("Errore durante l'aggiunta dell'esercizio:", err);
        res.status(500).json({ message: "Errore del server" });
    }
}); 

