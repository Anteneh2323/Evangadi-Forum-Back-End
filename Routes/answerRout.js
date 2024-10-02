const express = require("express");
const router = express.Router();

// Import controller functions from answerController
const {
  answerQuestion,
  allAnswers,
} = require("../Controller/answerControler");

// Route to post an answer
router.post("/answer-question/questionid", answerQuestion);

// Route to get all answers for a question
router.get("/all-answers/questionid", allAnswers);

module.exports = router;
