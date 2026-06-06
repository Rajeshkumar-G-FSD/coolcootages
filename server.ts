import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Ensure DNS resolution works correctly in sandboxed environments
dns.setDefaultResultOrder("ipv4first");

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // Initialize Gemini API client safely
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI Concierge functionality will return simulated responses.");
  }

  // API router / endpoint for the AI travel concierge
  app.post("/api/concierge", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages payload." });
      }

      // If AI client is not available, provide a helpful message
      if (!ai) {
        return res.json({
          text: "*Directing simulated concierge services...*\n\nWelcome to **Cool Cottages**! I am currently running in offline demonstration mode since the resort key has not been configured in the AI Studio Secrets panel.\n\nHowever, I can share that we feature our classic **CoolCottage Canopy Suites** ($1,100/night), **Beach Frontview Villas** ($1,650/night), and the majestic **Timber Living Suites** ($1,750/night). You can check their availability or browse our luxurious experiences (Yacht Cruise, Heli-Picnic, and Wellness Spa) directly on this portal! Please configure a `GEMINI_API_KEY` to launch full conversational butler recommendations.",
        });
      }

      // Convert messages to Gemini SDK contents format
      const contentParts = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const systemInstruction = `You are "Aurelia", the elite, 7-star Lead Butler & AI Concierge for COOL COTTAGES, situated in the premium hills. 
Your tone is deeply elegant, warm, respectful, sophisticated, and attentive. 
Provide extremely customized, high-end guidance on accommodations, leisure activities, dining requests, and packing suggestions.
Keep details authentic to Cool Cottages features:
- Core accommodations: 1) CoolCottages Entrance Canopy ($1,100/night, stone pathways, landscaped gardens). 2) CoolCottage Beach Frontview ($1,650/night, secluded private beach access). 3) Timber Living Suite ($1,750/night, expansive tropical hardwood living).
- Elite experiences: Yacht Cruise on 'The Azure Pearl' ($1,800), Heli-Picnic ridge landing ($2,400), Somatic Massage Sanctuary ($450), and Starlit Shoreline Dining Bubble ($600).
- Highlight tailored local dining and customized island itineraries.
- Always sign as "Aurelia, Your Private Cool Cottages Concierge" when terminating a primary recommendation. 
- Format your response beautifully using crisp Markdown lists, bold fonts, and gentle dividers to mirror luxury stationary. Make suggestions look pristine.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentParts,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I apologize, but I could not formulate a reply at this time. How else may I assist your stay at Cool Cottages?";
      return res.json({ text: replyText });
    } catch (error: any) {
      console.error("Gemini API backend error:", error);
      return res.status(500).json({
        error: "Our digital concierge is currently attending to another guest's request. Please try again shortly.",
        details: error.message,
      });
    }
  });

  // Hot module and static asset serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cool Cottages server running seamlessly on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the premium backend system:", error);
});
