const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.API_KEY });

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const { prompt, imageUrl } = req.body;
        
        let messages = [];
        
        // Jika ada gambar, kirim sebagai konten visi
        if (imageUrl) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: imageUrl } }
                ]
            });
        } else {
            // Jika hanya teks biasa
            messages.push({ role: "user", content: prompt });
        }

        const chat = await groq.chat.completions.create({
            model: "llama-3.2-90b-vision-preview",
            messages: messages
        });

        res.status(200).json({ response: chat.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
