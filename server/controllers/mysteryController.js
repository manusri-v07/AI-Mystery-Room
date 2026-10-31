
const Mystery = require("../models/Mystery");
const generateMystery = require("../services/generateMystery");

const createMystery = async (req, res) => {
  try {
    const { difficulty } = req.body;

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        message: "Please select a valid difficulty level."
      });
    }

    // Generate mystery using Gemini
    const mysteryData = await generateMystery(difficulty);

    // Save mystery in MongoDB
    const mystery = new Mystery({
  ...mysteryData,
  difficulty: difficulty,
  clues: mysteryData.clues.map((clue) => ({
    ...clue,
    isDiscovered: false
  }))
});

    await mystery.save();

    // Never expose the culprit, solution or hints here
    const publicMystery = {
      id: mystery._id,
      title: mystery.title,
      story: mystery.story,
      difficulty: mystery.difficulty,
      suspects: mystery.suspects,
      clues: mystery.clues.map((clue) => ({
  id: clue._id,
  description: "Undiscovered clue",
  isDiscovered: false
}))
    };

    return res.status(201).json({
      message: "Mystery created successfully!",
      mystery: publicMystery
    });

  } catch (error) {
    console.error("Create Mystery Error:", error.message);

    return res.status(500).json({
      message: "Unable to create mystery. Please try again."
    });
  }
};

module.exports = { createMystery };
