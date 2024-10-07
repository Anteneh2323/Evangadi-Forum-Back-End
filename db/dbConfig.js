const mysql = require("mysql2");
require("dotenv").config();

// Create a connection pool
const dbConnection = mysql.createPool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: "localhost",
  password: process.env.DB_PASSWORD, // Ensure this matches the updated variable name
  connectionLimit: 10,
});

// Test connection (optional)
// dbConnection.execute("SELECT 'test'", (err, results) => {
//   if (err) {
//     console.log("Database connection error:", err.message);
//   } else {
//     console.log("Database connection test successful:", results);
//   }
// });

module.exports = dbConnection.promise();
