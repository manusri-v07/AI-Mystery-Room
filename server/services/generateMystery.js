
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const mysterySchema = z.object({
  title: z.string().min(1),
  story: z.string().min(1),
  suspects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      motive: z.string(),
      alibi: z.string()
    })
  ),
  clues: z.array(
    z.object({
      description: z.string()
    })
  ),
  culprit: z.string(),
  solution: z.string(),
  hints: z.array(z.string())
});

const difficultySettings = {
  easy: { suspects: 3, clues: 5, hints: 2 },
  medium: { suspects: 4, clues: 7, hints: 3 },
  hard: { suspects: 5, clues: 9, hints: 3 }
};

const generateMystery = async (difficulty) => {
  const settings = difficultySettings[difficulty];

  if (!settings) {
    throw new Error("Invalid difficulty level");
  }

  const prompt = `
Create an original detective mystery game.

Difficulty: ${difficulty}

Requirements:
- Exactly ${settings.suspects} suspects.
- Exactly ${settings.clues} clues.
- Exactly ${settings.hints} progressive hints.
- Every suspect must have a name, description, motive and alibi.
- There must be exactly one culprit.
- The clues must logically support the culprit's identity.
- The solution must explain how the clues prove the culprit.
- Do not create contradictory clues.
- Make the story engaging and solvable.

Return ONLY valid JSON in this exact structure:
{
  "title": "Mystery title",
  "story": "The mystery story",
  "suspects": [
    {
      "name": "Name",
      "description": "Description",
      "motive": "Motive",
      "alibi": "Alibi"
    }
  ],
  "clues": [
    {
      "description": "Clue description"
    }
  ],
  "culprit": "Exact suspect name",
  "solution": "Full explanation",
  "hints": ["Hint 1", "Hint 2"]
}
`;

  let response;
let attempts = 0;
const maxAttempts = 3;

while (attempts < maxAttempts) {
  try {
    response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    break;
  } catch (error) {
    attempts++;

    const isTemporary =
      error.status === 503 ||
      error.status === 429 ||
      error.status === 500;

    if (!isTemporary || attempts >= maxAttempts) {
      throw error;
    }

    console.log(`Gemini retry ${attempts}/${maxAttempts}...`);

    await new Promise((resolve) =>
      setTimeout(resolve, attempts * 3000)
    );
  }
}

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed;

  try {
    parsed = JSON.parse(cleanedText);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  const mystery = mysterySchema.parse(parsed);

  if (
    mystery.suspects.length !== settings.suspects ||
    mystery.clues.length !== settings.clues ||
    mystery.hints.length !== settings.hints
  ) {
    throw new Error("Generated mystery does not match difficulty requirements");
  }

  const culpritExists = mystery.suspects.some(
    (suspect) => suspect.name === mystery.culprit
  );

  if (!culpritExists) {
    throw new Error("Culprit must match one of the suspects");
  }

  return mystery;
};

module.exports = generateMystery;
