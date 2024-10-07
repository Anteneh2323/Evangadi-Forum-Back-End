const mysql = require("mysql2");
require("dotenv").config();

// Create a connection pool
const dbConnection = mysql.createPool({
<<<<<<< HEAD
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: "localhost",
  password: process.env.DB_PASSWORD, // Ensure this matches the updated variable name
=======
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
>>>>>>> 839131fa115f14a06166cf34dabe5916eecafabd
  connectionLimit: 10,
  queueLimit: 0
});
<<<<<<< HEAD

// Test connection (optional)
// dbConnection.execute("SELECT 'test'", (err, results) => {
=======
// dbConnection.execute("select'test'", (err, results) => {
>>>>>>> 839131fa115f14a06166cf34dabe5916eecafabd
//   if (err) {
//     console.log("Database connection error:", err.message);
//   } else {
//     console.log("Database connection test successful:", results);
//   }
// });

module.exports = dbConnection.promise();
