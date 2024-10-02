require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

const cors = require("cors");

app.use(cors());

// db connection
const dbConnection = require("./db/dbConfig");

// user routes middleware
const usersRoutes = require("./Routes/useRoute");

// Question routes middleware
const questionRoutes = require("./Routes/questionRout");

// answer routes middleware file
const answerRoute = require("./Routes/answerRout");
// Import the authentication middleware
const authMiddleware = require("./middleware/authMiddleware");

//jason middle ware
app.use(express.json());

// usersRoutes middleware
app.use("/api/users/", usersRoutes);

// usersRoutes middleware
app.use("/api/question", authMiddleware, questionRoutes);

// answer routes middleware ??
app.use("/api/answers", authMiddleware, answerRoute);

// answer routes middleware ??
//app.use("/api/answers", authMiddleWare, answerRoute);

// Function to handle the database query using async/await


const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL UNIQUE
  );
`;


const createQuestionTable = `
  CREATE TABLE IF NOT EXISTS question (
    questionid INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    questiondescription TEXT,
    userid INT,
    postid VARCHAR(255) UNIQUE,
    FOREIGN KEY (userid) REFERENCES users(userid)
  );
`;

const createAnswersTable = `
  CREATE TABLE IF NOT EXISTS answers (
    answerid INT AUTO_INCREMENT PRIMARY KEY,
    answer TEXT NOT NULL,
    userid INT,
    questionid INT,
    FOREIGN KEY (userid) REFERENCES users(userid),
    FOREIGN KEY (questionid) REFERENCES question(questionid)
  );
`;


async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    await dbConnection.execute(createAnswersTable);
    console.log("Users table created");


    app.listen(port);
    console.log("database connection established");
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
