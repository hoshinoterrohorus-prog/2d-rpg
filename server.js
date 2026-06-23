require("dotenv").config();
const express = require("express");
const Groq = require("groq-sdk");
const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.API_KEY });

app.post("/ask", async (req, res) => {
    try {
        const chat = await groq.chat.completions.create({
            messages: [{ role: "user", content: req.body.prompt }],
            model: "llama3-8b-8192"
        });
        res.json({ response: chat.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, "0.0.0.0", () => console.log("Spectre Ai aktif di port 3000"));
