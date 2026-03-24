export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ELEVENLABS_KEY;
  if (!apiKey) return res.status(500).json({ error: "ELEVENLABS_KEY not set" });

  try {
    const { text, voiceId } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || "yiWEefwu5z3DQCM79clN"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
      body: JSON.stringify({
        text: text.slice(0, 500),
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    const buf = await r.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(Buffer.from(buf));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
