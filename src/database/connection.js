const mysql = require("mysql2/promise");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

console.log(process.env);

if (!process.env.MYSQL_DATABASE && !process.env.MYSQL_URL) {
  throw new Error("MYSQL_DATABASE or MYSQL_URL not set");
}

const config =
  ENV === "production"
    ? {
        connectionLimit: 10,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      }
    : {
        connectionLimit: 10,
        host: "localhost",
        user: "root",
        password: "sqlpass",
        database: process.env.MYSQL_DATABASE || "recipe_app",
      };

module.exports = mysql.createPool(config);
