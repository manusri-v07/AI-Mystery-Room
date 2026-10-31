
const Mystery = require("../models/Mystery");

// Helper: Send only information the player is allowed to see
const getPublicMystery = (mystery) => ({
  id: mystery._id,
  title: mystery.title,
  story: mystery.story,
  difficulty: mystery.difficulty,
  suspects: mystery.suspects,
  clues: mystery.clues.map((clue) => ({
    id: clue._id,
    description: clue.isDiscovered
      ? clue.description
      : "Undiscovered clue",
    isDiscovered: clue.isDiscovered
  })),
  score: mystery.score,
  hintsUsed: mystery.hintsUsed,
  isSolved: mystery.isSolved
});

// 1. Get mystery details
const getMystery = async (req, res) => {
  try {
    const mystery = await Mystery.findById(req.params.id);

    if (!mystery) {
      return res.status(404).json({
        message: "Mystery not found"
      });
    }

    return res.json({
      mystery: getPublicMystery(mystery)
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid mystery ID"
    });
  }
};

// 2. Discover a clue
const discoverClue = async (req, res) => {
  try {
    const { clueId } = req.params;

    const mystery = await Mystery.findById(req.params.id);

    if (!mystery) {
      return res.status(404).json({
        message: "Mystery not found"
      });
    }

    if (mystery.isSolved) {
      return res.status(400).json({
        message: "This mystery has already been solved"
      });
    }

    const clue = mystery.clues.id(clueId);

    if (!clue) {
      return res.status(404).json({
        message: "Clue not found"
      });
    }

    if (clue.isDiscovered) {
      return res.status(400).json({
        message: "Clue already discovered"
      });
    }

    clue.isDiscovered = true;
    mystery.score += 5;

    await mystery.save();

    return res.json({
      message: "Clue discovered!",
      clue: {
        id: clue._id,
        description: clue.description,
        isDiscovered: true
      },
      score: mystery.score
    });
  } catch (error) {
    console.error("Discover Clue Error:", error.message);

    return res.status(500).json({
      message: "Unable to discover clue"
    });
  }
};

// 3. Request a hint
const useHint = async (req, res) => {
  try {
    const mystery = await Mystery.findById(req.params.id);

    if (!mystery) {
      return res.status(404).json({
        message: "Mystery not found"
      });
    }

    if (mystery.isSolved) {
      return res.status(400).json({
        message: "This mystery has already been solved"
      });
    }

    if (mystery.hintsUsed >= mystery.hints.length) {
      return res.status(400).json({
        message: "No hints remaining"
      });
    }

    const hint = mystery.hints[mystery.hintsUsed];

    mystery.hintsUsed += 1;
    mystery.score = Math.max(0, mystery.score - 10);

    await mystery.save();

    return res.json({
      message: "Hint unlocked!",
      hint,
      hintsRemaining: mystery.hints.length - mystery.hintsUsed,
      score: mystery.score
    });
  } catch (error) {
    console.error("Use Hint Error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve hint"
    });
  }
};

// 4. Accuse a suspect
const accuseSuspect = async (req, res) => {
  try {
    const { suspectName } = req.body;

    if (!suspectName || typeof suspectName !== "string") {
      return res.status(400).json({
        message: "Please provide a valid suspect name."
      });
    }

    const mystery = await Mystery.findById(req.params.id)
      .select("+culprit +solution");

    if (!mystery) {
      return res.status(404).json({
        message: "Mystery not found"
      });
    }

    if (mystery.isSolved) {
      return res.status(400).json({
        message: "This mystery has already been solved"
      });
    }

    const suspectExists = mystery.suspects.some(
      (suspect) => suspect.name === suspectName
    );

    if (!suspectExists) {
      return res.status(400).json({
        message: "Invalid suspect. Please choose a listed suspect."
      });
    }

    const isCorrect = suspectName === mystery.culprit;

    const pointsByDifficulty = {
      easy: 100,
      medium: 150,
      hard: 200
    };

    if (isCorrect) {
      mystery.score += pointsByDifficulty[mystery.difficulty];
    }

    mystery.score = Math.max(0, mystery.score);
    mystery.isSolved = true;

    await mystery.save();

    return res.json({
      message: isCorrect
        ? "Correct accusation! Mystery solved!"
        : "Wrong accusation! Mystery solved.",
      isCorrect,
      accusedSuspect: suspectName,
      culprit: mystery.culprit,
      solution: mystery.solution,
      score: mystery.score
    });

  } catch (error) {
    console.error("Accuse Suspect Error:", error.message);

    return res.status(500).json({
      message: "Unable to process accusation"
    });
  }
};

module.exports = {
  getMystery,
  discoverClue,
  useHint,
  accuseSuspect
};
