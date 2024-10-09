const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

// Import controller functions from answerController
<<<<<<< HEAD
=======
const {
  answerQuestion,
  allAnswers,
} = require("../Controller/answerControler");
>>>>>>> 839131fa115f14a06166cf34dabe5916eecafabd

const {
  singANScontroller,
  allAnswers,
  editAnswerController,
} = require("../controller/answerController");

router.post("/single-answer", async (req, res) => {
  try {
    await singANScontroller(req, res);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error posting answer", error });
  }
});

// Route to get all answers for a question
router.get("/all-answers", async (req, res) => {
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
    await editAnswerController(req, res);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error editing answer", error });
  }
});

module.exports = router;
