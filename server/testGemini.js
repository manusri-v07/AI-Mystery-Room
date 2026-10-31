require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function testGemini() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "Reply with exactly: Gemini connection successful!"
    });

    console.log(response.text);
  } catch (error) {
    console.error("Gemini Error:", error.message);
  }
}

testGemini();