// Import necessary modules
const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// Post an answer
const answerQuestion = async (req, res) => {
  const { questionid } = req.params;
  const { userId } = req.user;
  const { answer } = req.body;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide your answer" });
  }

  try {
    const [question] = await dbConnection.query(
      "SELECT * FROM question WHERE questionid = ?",
      [questionid]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    const query =
      "INSERT INTO answer (answer, userid, questionid) VALUES (?, ?, ?)";
    await dbConnection.query(query, [answer, userId, questionid]);

    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error posting the answer" });
  }
};

// Get all answers for a specific question
const allAnswers = async (req, res) => {
  const { questionid } = req.params;

  try {
    const [answers] = await dbConnection.query(
      "SELECT answer.*, registration.username FROM answer JOIN registration ON answer.userid = registration.userid WHERE questionid = ? ORDER BY answer.answerid DESC",
      [questionid]
    );

    if (answers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No answers found" });
    }

    res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching answers" });
  }
};

module.exports = { answerQuestion, allAnswers };
