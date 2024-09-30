// Import necessary modules
const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// Ask a question
const askQuestions = async (req, res) => {
  const { questionTitle, questionBody } = req.body;
  const { userId } = req.user;

  if (!questionTitle || !questionBody) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide a title and body for the question" });
  }

  try {
    const query = "INSERT INTO question (title, body, userid) VALUES (?, ?, ?)";
    await dbConnection.query(query, [questionTitle, questionBody, userId]);

    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question posted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error posting the question" });
  }
};

// Get all questions
const allQuestions = async (req, res) => {
  try {
    const [questions] = await dbConnection.query("SELECT * FROM question");

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found" });
    }

    res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching questions" });
  }
};

// Get a single question
const singleQuestions = async (req, res) => {
  const { question_id } = req.params;

  try {
    const [question] = await dbConnection.query(
      "SELECT * FROM question WHERE questionid = ?",
      [question_id]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    res.status(StatusCodes.OK).json({ question: question[0] });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching the question" });
  }
};

module.exports = { askQuestions, allQuestions, singleQuestions };
