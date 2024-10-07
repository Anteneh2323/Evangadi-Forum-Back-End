require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

const cors = require("cors");
// Middleware to handle CORS
app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

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

// json middleware
app.use(express.json());

// usersRoutes middleware
app.use("/api/users/", usersRoutes);

// questionRoutes middleware
app.use("/api/question", authMiddleware, questionRoutes);

// answer routes middleware
app.use("/api/answers", authMiddleware, answerRoute);

// answer routes middleware (with authMiddleware if needed)
// app.use("/api/answers", authMiddleware, answerRoute);

// Function to handle the database query using async/await
async function start() {
  try {
    await dbConnection.execute("select 'test' ");
    app.listen(port);
    console.log("database connection established");
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
