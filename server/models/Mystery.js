
const mongoose = require("mongoose");

const suspectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  motive: {
    type: String,
    required: true
  },
  alibi: {
    type: String,
    required: true
  }
});

const clueSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  isDiscovered: {
    type: Boolean,
    default: false
  }
});

const mysterySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    story: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    },
    suspects: [suspectSchema],
    clues: [clueSchema],
    culprit: {
      type: String,
      required: true,
      select: false
    },
    solution: {
      type: String,
      required: true,
      select: false
    },
    hints: {
      type: [String],
      default: []
    },
    hintsUsed: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    },
    isSolved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mystery", mysterySchema);
