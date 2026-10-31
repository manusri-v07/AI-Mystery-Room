
const express = require("express");
const router = express.Router();

const {
  createMystery
} = require("../controllers/mysteryController");

router.post("/", createMystery);

module.exports = router;
