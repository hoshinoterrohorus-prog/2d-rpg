const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.API_KEY });

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const chat = await groq.chat.completions.create({
            messages: [{ role: "user", content: req.body.prompt }],
            model: "llama3-8b-8192"
        });
        res.json({ response: chat.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
