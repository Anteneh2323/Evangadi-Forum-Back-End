// Import necessary modules
const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// Post an answer
const answerQuestion = async (req, res) => {
  const { question_id, user_id, answer } = req.body;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide your answer" });
  }

  try {
    const [singleQuestions] = await dbConnection.query(
      "SELECT question.*, users.username FROM question JOIN users ON question.user_id = users.user_id WHERE question_id = ?",
      [question_id]
    );

    if (singleQuestions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    const answerQuery =
      "INSERT INTO answers (user_id, question_id, answer) VALUES (?, ?, ?)";
    await dbConnection.query(answerQuery, [user_id, question_id, answer]);

    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error posting the answer" });
  }
};

const allAnswers = async (req, res) => {
  const { question_id } = req.params;

  // Validate that question_id is provided
  if (!question_id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Question ID is required.",
    });
  }

  try {
    const [answers] = await dbConnection.query(
      "SELECT answers.*, users.username FROM answers JOIN users ON answers.user_id = users.user_id WHERE answers.question_id = ? ORDER BY answers.answer_id DESC",
      [question_id]
    );

    if (answers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No answers found for question ID: ${question_id}` });
    }

    // Successful response with count of answers
    return res.status(StatusCodes.OK).json({
      msg: `${answers.length} answers retrieved successfully.`,
      answers,
    });
  } catch (error) {
    console.error("Error retrieving answers:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "An error occurred while retrieving answers. Please try again later.",
    });
  }
};

// Edit an existing answer
const editAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { answer } = req.body;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide an updated answer" });
  }

  try {
    const [existingAnswer] = await dbConnection.query(
      "SELECT * FROM answers WHERE answer_id = ?",
      [answer_id]
    );

    if (existingAnswer.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Answer not found" });
    }

    const updateQuery = "UPDATE answers SET answer = ? WHERE answer_id = ?";
    await dbConnection.query(updateQuery, [answer, answer_id]);

    res.status(StatusCodes.OK).json({ msg: "Answer updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error updating the answer" });
  }
};

module.exports = {
  answerQuestion,
  allAnswers,
  editAnswer,
};
