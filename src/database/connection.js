const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "precious-pike-smockCyclicDB",
  user: "joe",
  password: "sqlpassword",
  database: "precious-pike-smockCyclicDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;
