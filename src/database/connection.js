const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "https://recipe-app.cyclic.app/",
  user: "joe",
  password: "sqlpassword",
  database: "recipe_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;
