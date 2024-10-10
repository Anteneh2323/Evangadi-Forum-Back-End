const express = require("express");
const router = express.Router();


// Import controller functions from questionController
const {
  askQuestion,
  getAllQuestions,
  getSingleQuestion,
} = require("../Controller/questionController");


// Route to ask a question
router.post("/ask-question", askQuestion);

// Route to get all questions
router.get("/all-questions", getAllQuestions);

// Route to get a single question by ID
router.get("/single-question/:question_id", getSingleQuestion);

module.exports = router;
