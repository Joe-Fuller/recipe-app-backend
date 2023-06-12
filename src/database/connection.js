const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "recipe-app.cyclic.app",
  user: "joe",
  password: "sqlpass",
  database: "recipe_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;
