export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_KEY not set" });

  try {
    const body = req.body;
    if (!body?.messages) return res.status(400).json({ error: "messages required" });

    const modelMap = {
      "claude-3-5-sonnet-20241022": "claude-sonnet-4-5",
      "claude-3-haiku-20240307":    "claude-haiku-4-5",
      "claude-haiku-4-5-20251001":  "claude-haiku-4-5",
    };
    const VALID = ["claude-sonnet-4-5", "claude-haiku-4-5", "claude-opus-4-5"];
    const model = VALID.includes(body.model) ? body.model : (modelMap[body.model] || "claude-sonnet-4-5");

    const payload = {
      model,
      max_tokens: Math.min(body.max_tokens || 2000, 8000),
      messages: body.messages,
    };
    if (body.system) payload.system = body.system;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { error: text }; }
    if (!r.ok) return res.status(r.status).json(data);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
