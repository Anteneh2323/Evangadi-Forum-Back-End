const express = require("express");
const app = express();
const port = process.env.PORT;

const cors = require("cors");

app.use(cors());


const dbConnection = require("./db/dbConfig");

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    usename VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL UNIQUE
  );
`;

const createQuestionTable = `
  CREATE TABLE IF NOT EXISTS question (
    questionid INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    userid INT,
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
// Function to create tables sequentially
async function createTables() {
  try {
 
    const result = await dbConnection.execute("select 'test' ");
    //console.log(result)
     //
    //
    //await dbConnection.execute(createUsersTable);
    //console.log("Users table created");
    //
    await dbConnection.query(createQuestionTable);
    console.log("Question table created");
    //
    await dbConnection.query(createAnswersTable);
    console.log("Answers table created");
  } catch (error) {
    console.error("Error creating table: ", error.message);
  } finally {
    dbConnection.end(); // Close the connection after all queries
  }
}

createTables();

