import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI with lazy validation
let ai: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. API calls will fail.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "MISSING_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// REST route for Text to Speech (TTS)
app.post("/api/tts", async (req: express.Request, res: express.Response) => {
  try {
    const { text, voiceName = "Kore", mood = "naturally" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Văn bản không được để trống." });
    }

    const aiClient = getGenAI();
    
    // We construct a speech instruction for the TTS model
    const instructionPrompt = `Say in a Vietnamese female tone, clearly, warmly, and ${mood}: ${text}`;

    console.log(`Generating TTS | Voice: ${voiceName} | Mood: ${mood} | Length: ${text.length} chars`);

    const response = await aiClient.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: instructionPrompt }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      console.error("No audio data received from Gemini API. Structure:", JSON.stringify(response.candidates));
      throw new Error("Không nhận được dữ liệu âm thanh từ mô hình AI.");
    }

    res.json({ audio: base64Audio });
  } catch (error: any) {
    console.error("Error in TTS generation backend:", error);
    res.status(500).json({ error: error.message || "Lỗi chuyển đổi văn bản sang giọng nói." });
  }
});

// Vite dev server mounting or static folder serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
