const mysql = require("mysql2/promise");

// const connection = mysql.createPool({
//   host: "recipe-app.cyclic.app",
//   user: "joe",
//   password: "sqlpassword",
//   database: "recipe_app",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

var connection = mysql.createPool({
  host: "gateway01.us-east-1.prod.aws.tidbcloud.com",
  port: 4000,
  user: "3Acn8QAwBVJorbf.root",
  password: "Dr0xuKIuTdgNiCTl",
  database: "recipe_app",
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;
