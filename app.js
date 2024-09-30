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
const answerRoute = require("./routes/answerRout");
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

async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");

    app.listen(port);
    console.log("database connection established");
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
