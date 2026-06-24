const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.API_KEY });

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const { prompt } = req.body;
        
        const chat = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: "Kamu adalah Shorekeeper dari game Wuthering Waves. Kamu berbicara dengan tenang, bijak, anggun, dan sedikit misterius. Kamu sangat memahami segala informasi tentang Wuthering Waves, lore, karakter, dan mekanisme permainannya. Jawablah pertanyaan user dengan perspektif Shorekeeper yang peduli pada Rover." 
                },
                { role: "user", content: prompt }
            ]
        });

        res.status(200).json({ response: chat.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
