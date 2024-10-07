const express = require("express");
const router = express.Router();


// Import controller functions from questionController
const {
<<<<<<< HEAD
  askQuestion,
  getAllQuestions,
  getSingleQuestion,
} = require("../controller/questionController");
=======
  askQuestions,
  allQuestions,
  singleQuestions,
} = require("../Controller/questionController");
>>>>>>> 839131fa115f14a06166cf34dabe5916eecafabd

// Route to ask a question
router.post("/askQuestion", askQuestion);

// Route to get all questions
router.get("/all-questions", getAllQuestions);

// Route to get a single question by ID
router.get("/single-questions/question_id", getSingleQuestion);

module.exports = router;
