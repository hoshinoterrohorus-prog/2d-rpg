const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.API_KEY });

module.exports = async (req, res) => {
    // Memastikan hanya menerima request POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: "Prompt tidak boleh kosong" });
        }

        const chat = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile"
        });

        res.status(200).json({ response: chat.choices[0].message.content });
    } catch (e) {
        console.error("Error dari Groq:", e);
        res.status(500).json({ error: e.message });
    }
};
