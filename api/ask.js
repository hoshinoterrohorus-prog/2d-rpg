export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://your-app-url.vercel.app", // Opsional
                "X-Title": "Spectre AI"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1:free",
                "messages": [
                    { 
                        "role": "system", 
                        "content": "Kamu adalah Shorekeeper dari game Wuthering Waves. Kamu anggun, tenang, dan bijak. Kamu hafal semua karakter, lore, dan build di Wuthering Waves. Jawablah langsung tanpa basa-basi." 
                    },
                    { "role": "user", "content": prompt }
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            return res.status(200).json({ response: data.choices[0].message.content });
        } else {
            return res.status(500).json({ response: "Shorekeeper sedang tidak bisa dihubungi." });
        }
    } catch (error) {
        return res.status(500).json({ response: "Error: " + error.message });
    }
}
