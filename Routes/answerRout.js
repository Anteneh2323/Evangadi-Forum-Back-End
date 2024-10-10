const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

// Import controller functions from answerController
const {
  answerQuestion,
  allAnswers,
  editAnswer,
} = require("../Controller/answerController");

router.post("/single-answer", async (req, res) => {
  try {
    await answerQuestion(req, res);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error posting answer", error });
  }
});

// Route to get all answers for a question
router.get("/all-answers/:question_id", async (req, res) => {
  try {
    await allAnswers(req, res);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving answers", error });
  }
});

// Route to edit an answer (assuming you have this function)
router.put("/edit-answer/:answer_id", async (req, res) => {
  try {
    await editAnswer(req, res);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error editing answer", error });
  }
});

module.exports = router;
