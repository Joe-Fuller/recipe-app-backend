const mysql = require("mysql2/promise");

async function createDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: "recipe-app.cyclic.app",
      user: "joe",
      password: "sqlpass",
    });

    // Create the database
    await connection.query("CREATE DATABASE IF NOT EXISTS recipe_app");

    // Use the database
    await connection.query("USE recipe_app");

    // Create the Recipe table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Recipe (
          recipe_id INT PRIMARY KEY AUTO_INCREMENT,
          recipe_name VARCHAR(255),
          time_to_cook INT
        )
      `);

    // Create the Ingredient table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Ingredient (
          ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
          ingredient_name VARCHAR(255),
          recipe_id INT,
          FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id) ON DELETE CASCADE
        )
      `);

    // Create the Instruction table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Instruction (
          instruction_id INT PRIMARY KEY AUTO_INCREMENT,
          instruction_text TEXT,
          recipe_id INT,
          FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id) ON DELETE CASCADE
        )
      `);

    console.log("Database created successfully");
  } catch (error) {
    console.error("Error creating the database:", error);
  } finally {
    if (connection) {
      // Close the connection
      connection.end();
    }
  }
}

createDatabase();
