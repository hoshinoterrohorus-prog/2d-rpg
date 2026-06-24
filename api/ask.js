export default async function handler(req, res) {
    // 1. Pastikan hanya menerima POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    // 2. Validasi API Key
    if (!apiKey) {
        console.error("DEBUG: API Key tidak ditemukan!");
        return res.status(500).json({ error: "API Key konfigurasi salah" });
    }

    try {
        // 3. Request ke OpenRouter
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://spectre1.vercel.app/", // Ganti dengan domain kamu
                "X-Title": "Spectre AI"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-exp:free",
                "messages": [
                    { "role": "system", "content": "Kamu adalah Shorekeeper, asisten yang cerdas." },
                    { "role": "user", "content": prompt }
                ]
            })
        });

        const data = await response.json();

        // 4. Jika OpenRouter error
        if (!response.ok) {
            console.error("DETAIL ERROR OPENROUTER:", data);
            return res.status(response.status).json({ error: "Gagal dari API AI" });
        }

        // 5. Berhasil
        res.status(200).json({ response: data.choices[0].message.content });

    } catch (e) {
        console.error("DETAIL ERROR SERVER:", e);
        res.status(500).json({ error: e.message });
    }
}
