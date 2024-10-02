const express = require("express");
const router = express.Router();

// Import controller functions from questionController
const {
  askQuestions,
  allQuestions,
  singleQuestions,
} = require("../Controller/questionController");

// Route to ask a question
router.post("/ask-questions", askQuestions);

// Route to get all questions
router.get("/all-questions", allQuestions);

// Route to get a single question by ID
router.get("/single-questions/question_id", singleQuestions);

module.exports = router;
