const Groq = require("groq-sdk");
const { google } = require("googleapis");
const groq = new Groq({ apiKey: process.env.API_KEY });
const customsearch = google.customsearch('v1');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const { prompt, imageUrl } = req.body;
        let aiResponse = "";
        let foundImageUrl = null;

        // 1. Jika User minta cari gambar
        if (prompt.toLowerCase().includes("cari gambar") || prompt.toLowerCase().includes("tampilkan gambar")) {
            const searchResult = await customsearch.cse.list({
                cx: process.env.GOOGLE_CX,
                q: prompt.replace(/cari gambar|tampilkan gambar/gi, ""),
                auth: process.env.GOOGLE_API_KEY,
                searchType: 'image',
                num: 1
            });
            foundImageUrl = searchResult.data.items?.[0]?.link;
            aiResponse = "Ini gambar yang kamu minta.";
        } 
        // 2. Jika User kirim link gambar (Vision)
        else {
            let messages = [{ role: "user", content: [] }];
            messages[0].content.push({ type: "text", text: prompt });
            if (imageUrl) {
                messages[0].content.push({ type: "image_url", image_url: { url: imageUrl } });
            }

            const chat = await groq.chat.completions.create({
                model: "llama-3.2-90b-vision-instruct",
                messages: messages
            });
            aiResponse = chat.choices[0].message.content;
        }

        res.status(200).json({ response: aiResponse, imageUrl: foundImageUrl });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
