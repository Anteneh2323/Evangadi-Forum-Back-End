const mysql = require("mysql2");

// Create a connection pool
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// dbConnection.execute("select'test'", (err, results) => {
//   if (err) {
//     console.log(err.message);
//   } else {
//     console.log(results);
//   }
// });

module.exports = dbConnection.promise();
