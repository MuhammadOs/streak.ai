import Groq from "groq-sdk";

let client = null;
const getClient = () => {
  if (client) return client;
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  client = new Groq({ apiKey: key });
  return client;
};

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export const isAIEnabled = () => !!process.env.GROQ_API_KEY;

export const parseJSON = (text) => {
  let cleaned = (text || "").trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```\n?/g, "");
  }
  return JSON.parse(cleaned.trim());
};

export const chatCompletion = async ({ system, user, temperature = 0.7 }) => {
  const c = getClient();
  if (!c) {
    return {
      ok: false,
      content:
        "AI features are disabled — set GROQ_API_KEY in the backend .env to enable AI responses.",
    };
  }
  try {
    const res = await c.chat.completions.create({
      model: MODEL,
      temperature,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const content = res.choices[0]?.message?.content ?? "";
    return { ok: true, content };
  } catch (err) {
    console.error("AI error:", err);
    return { ok: false, content: "AI request failed. Please try again later." };
  }
};

export const SYSTEM_PROMPTS = {
  weekly: `You are a supportive habit coach. Analyse the user's weekly habit data and write a warm, personalised report (150–200 words). Highlight wins, identify patterns, and give one concrete suggestion. Use markdown formatting.`,

  suggestion: `You are a habit design expert. Suggest exactly 3 personalised habits based on the user's goals. Return ONLY a JSON object in this exact format, no other text:
{
  "suggestions": [
    {
      "name": "habit name",
      "description": "short description",
      "frequency": "daily",
      "category": "Fitness|Health|Learning|Mindfulness|Productivity|Social|Other",
      "icon": "single emoji",
      "reason": "why this habit suits the user"
    }
  ]
}`,

  recovery: `You are a compassionate habit coach. The user broke a streak. Write a warm, non-judgmental 3-day recovery plan (120–160 words). Be encouraging and specific. Use markdown formatting.`,

  chat: `You are an insightful habit analytics assistant. Answer the user's question using only the habit data provided. Be concise, specific, and actionable. Use markdown formatting where helpful.`,

  morning: `You are an energising morning coach. Write a short, personalised morning message (60–80 words) based on the user's current streaks and today's progress. Be warm, specific, and motivating. No generic advice.`,
};
