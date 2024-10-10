// Import necessary modules
const express = require("express");
const crypto = require("crypto");
const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const askQuestion = async (req, res) => {
  const { title, description} = req.body; // Include tag in request body


  // Validate inputs
  if (
    !title ||
    title.length > 255 ||
    !description ||
    description.length > 1000
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide valid title and description.",
    });
  }

  try {
    //console.log(req)
    // Check if req.user is populated (user should be authenticated)
    if (!req.user || !req.user.userid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "User not authenticated.",
      });
    }

    const user_id = req.user.userid;
    //console.log(req.user)
    //const question_id = crypto.randomUUID(); // Generate a unique question ID

    // Check if tag is provided, otherwise generate one
    //const tagValue = tag || crypto.randomUUID(); // Use provided tag or generate a random one

    const insertQuestionQuery =
      "INSERT INTO question (title, userid, description) VALUES (?, ?, ?)";

    //console.log("Inserting question:", {
    //  title,
    //  user_id,
    //  description,
    //  //tag: tagValue,
    //});

    // Execute the query
    await dbConnection.query(insertQuestionQuery, [
      title,
      user_id,
      description,
    ]);

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: `Question posted successfully by UserID: ${user_id}` });
  } catch (error) {
    console.error("Error during inserting question:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error posting the question, try again later." });
  }
};


// Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const [questions] = await dbConnection.query(
      "SELECT question.*, users.username FROM question JOIN users ON question.userid = users.userid ORDER BY question.questionid DESC"
    );

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found" });
    }

    res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching questions, try again later" });
  }
};

const getSingleQuestion = async (req, res) => {
  const { question_id } = req.params; // Get question ID from request params

  // Validate that question_id is provided
  if (!question_id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Question ID is required.",
    });
  }

  try {
    const getSingleQuestionQuery = `
      SELECT 
        q.questionid, 
        q.title, 
        q.description, 
        u.username 
      FROM 
        question q
      JOIN 
        users u 
      ON 
        q.userid = u.userid 
      WHERE 
        q.questionid = ?;
    `;

    const [question] = await dbConnection.query(getSingleQuestionQuery, [
      question_id,
    ]);

    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Question not found.",
      });
    }

    return res.status(StatusCodes.OK).json({ question: question[0] });
  } catch (error) {
    console.error("Error fetching the question:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching the question, try again later.",
    });
  }
};


module.exports = { askQuestion, getAllQuestions, getSingleQuestion };
