// db connection
const express = require("express");
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// Register User
async function Register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;


  // Validate if all fields are filled
   
  if (!username) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Username is required" });
  }

  if (!firstname) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "First name is required" });
  }

  if (!lastname) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Last name is required" });
  }

  if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Email is required" });
  }

  if (!password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password is required" });
  }

// If all fields are filled, you can proceed with your logic
  try {
    // Check if username or email already exists
    const [users] = await dbConnection.query(
      "SELECT username, userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (users.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Username or email already exists" });
    }

    // Check password length
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters long" });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10); // Adjust salt rounds as per your need
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: `User ${username} registered successfully` });
  } catch (err) {
    console.log(err.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

// Login User
async function Login(req, res) {
  const { email, password } = req.body;

  // Validate if all fields are filled
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please fill all the fields" });
  }

  try {
    // Check if user exists by email
    const [users] = await dbConnection.query(
      "SELECT username, userid, password FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    const user = users[0]; // Get the first result (since emails are unique)

    // Compare password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, userid: user.userid },
      process.env.JUT_SECRET, 
      // Replace with a secure secret in production
      { expiresIn: "1d" } // Token expires in 1 day
    );

    return res.status(StatusCodes.OK).json({
      msg: "Login successful",
      token,
      username: user.username,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

// CheckUser (you may implement this as needed)
async function CheckUser(req, res) {
const username =req.user.username
const userid = req.user.userid

  res.status(StatusCodes.OK).json({msg:"Valid user",userid,username});

}

module.exports = { Register, Login, CheckUser };
