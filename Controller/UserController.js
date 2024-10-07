// db connection
const express = require("express");
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

// Register User
async function Register(req, res) {
  const { user_id, username, firstname, lastname, email, password } = req.body;


  // Validate if all fields are filled
<<<<<<< HEAD

  
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
=======
   
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
>>>>>>> 839131fa115f14a06166cf34dabe5916eecafabd
  try {
    // Check if username or email already exists
    const [users] = await dbConnection.query(
      "SELECT username, user_id FROM users WHERE username = ? OR email = ?",
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
      "INSERT INTO users (user_id, username, firstname, lastname, email, password) VALUES (?,?,?,?,?,?)",
      [user_id, username, firstname, lastname, email, hashedPassword]
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
      "SELECT username, user_id, password FROM users WHERE email = ?",
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
      { username: user.username, user_id: user.user_id },
      process.env.JWT_SECRET,
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
      .json({
        msg: "Something went wrong, try again later",
        username: user.username,
      });
  }
}

// CheckUser (you may implement this as needed)
async function CheckUser(req, res) {
  try {
    // Check if the authorization header is present
    if (!req.headers.authorization) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Unauthorized, no token provided" });
    }

    // Extract token
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Unauthorized, token is missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_id, username } = decoded;

    // Respond with user details
    return res.status(StatusCodes.OK).json({ user_id, username });
  } catch (error) {
    console.error("Token validation failed:", error.message);

    // Handle specific errors (e.g., expired token, malformed token)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Unauthorized, token expired" });
    }

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Unauthorized, invalid token" });
  }
}

// Forgot Password Function
async function ForgotPassword(req, res) {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Email is required" });
  }

  try {
    // Check if the email exists in the database
    const [users] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Email not found" });
    }

    const user = users[0];

    // Generate a reset token (valid for 1 hour)
    const resetToken = jwt.sign({ email: user.email, user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send reset token via email using NodeMailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use other email providers (Outlook, Yahoo, etc.)
      auth: {
        user: process.env.EMAIL_USER, // Add your email here (use environment variables)
        pass: process.env.EMAIL_PASS, // Add your email password (use environment variables)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email
      to: email, // Recipient's email
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error sending email. Please try again later." });
      }
      return res.status(StatusCodes.OK).json({ msg: "Password reset link sent to your email" });
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong. Please try again later." });
  }
}

module.exports = { Register, Login, CheckUser, ForgotPassword };