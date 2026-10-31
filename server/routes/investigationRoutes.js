
const express = require("express");
const router = express.Router();

const {
  getMystery,
  discoverClue,
  useHint,
  accuseSuspect
} = require("../controllers/investigationController");

router.get("/:id", getMystery);

router.post("/:id/clues/:clueId", discoverClue);

router.post("/:id/hints", useHint);

router.post("/:id/accuse", accuseSuspect);

module.exports = router;
