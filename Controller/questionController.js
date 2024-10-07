// Import necessary modules
const express = require("express");
const crypto = require("crypto");
const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const askQuestion = async (req, res) => {
  const { title, description, tag } = req.body; // Include tag in request body

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
    // Check if req.user is populated (user should be authenticated)
    if (!req.user || !req.user.user_id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "User not authenticated.",
      });
    }

    const { user_id } = req.user;
    const question_id = crypto.randomUUID(); // Generate a unique question ID

    // Check if tag is provided, otherwise generate one
    const tagValue = tag || crypto.randomUUID(); // Use provided tag or generate a random one

    const insertQuestionQuery =
      "INSERT INTO question (question_id, title, user_id, description, tag) VALUES (?, ?, ?, ?, ?)";

    console.log("Inserting question:", {
      question_id,
      title,
      user_id,
      description,
      tag: tagValue,
    });

    // Execute the query
    await dbConnection.query(insertQuestionQuery, [
      question_id,
      title,
      user_id,
      description,
      tagValue,
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
      "SELECT question.*, users.username FROM question JOIN users ON question.user_id = users.user_id ORDER BY question.question_id DESC"
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
        q.question_id, 
        q.title, 
        q.description, 
        q.tag, 
        u.username 
      FROM 
        question q
      JOIN 
        users u 
      ON 
        q.user_id = u.user_id 
      WHERE 
        q.question_id = ?;
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
