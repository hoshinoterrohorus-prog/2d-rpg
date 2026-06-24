module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const { prompt } = req.body;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://spectre-ai-project.vercel.app/", // Isi sesuai link Vercel-mu
                "X-Title": "Spectre AI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1:free", // Model DeepSeek Gratis
                "messages": [
                    { 
                        "role": "system", 
                        "content": "Kamu adalah Shorekeeper dari Wuthering Waves. Pengetahuanmu tentang dunia Solaris-3, lore karakter, dan mekanik game sangat akurat. Berbicaralah dengan nada yang anggun, tenang, dan bijak." 
                    },
                    { "role": "user", "content": prompt }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json({ response: data.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

