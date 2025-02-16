import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import db from "./db"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json()); 

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing. Please set it in .env.");
  process.exit(1);
}

app.get('/api/professors', (req, res) => {
  const sql = 'SELECT * FROM professors';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching professors:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

app.post(
  "/api/generateLetter",
  async (req: Request<object, object, { resumeText: string; professor: string }>, res: Response) => {
    try {
      const { resumeText, professor } = req.body;

      if (!resumeText || !professor) {
        res.status(400).json({ error: "Resume text and professor are required." });
        return;
      }

      const prompt = `Based on the following resume text, generate a professional cover letter addressed to Professor ${professor} about their research.
      
      --- Resume Start ---
      ${resumeText}
      --- Resume End ---

      The cover letter should:
      - Be concise and professional.
      - Highlight relevant skills and experience.
      - Express interest in learning more and request a meeting.
      - Be formatted properly with a subject line and email signature.
      `;

      console.log("🔹 Sending request to Gemini API...");

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        }),
      });
      
      

      if (!response.ok) {
        const errorDetails = await response.text(); // Log full response
        console.error("❌ Gemini API Request Failed:", response.status, response.statusText, errorDetails);
        res.status(500).json({ error: "Gemini API request failed.", details: errorDetails });
        return;
      }      

      const data = await response.json();
      console.log("📩 Gemini API Response:", data);

      const letterText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Could not extract letter text";

      res.status(200).json({ letter: letterText });
    } catch (error) {
      console.error("❌ Error generating letter:", error);

      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to generate letter." });
      }
    }
  }
);


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});