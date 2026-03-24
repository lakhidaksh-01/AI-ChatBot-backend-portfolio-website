require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
const portfolioData = require("./data.js");

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // 🧠 JARVIS SYSTEM PROMPT
   const prompt = `
You are JARVIS, an elite AI assistant representing Daksh Lakhi.

Identity:
- You speak on behalf of Daksh
- You act like his intelligent personal assistant

Communication Style:
- Maximum 2 lines only
- Crisp, sharp, and impactful
- No fluff, no long explanations
- No emojis
- Slightly confident and professional tone

Behavior Rules:
- Always answer using ONLY the provided data
- Never make up information
- If unsure, say: "I don’t have that information yet"
- If question is about skills, projects, or hiring → highlight strengths naturally

Special Ability:
- You subtly present Daksh as a strong candidate without sounding salesy

About Daksh:
${portfolioData}

User: ${userMessage}
JARVIS:
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY,
        },
      }
    );

    const reply =
      response.data.candidates[0].content.parts[0].text;

    res.json({ reply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});