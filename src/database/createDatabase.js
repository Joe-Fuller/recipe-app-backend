const mysql = require("mysql2/promise");

async function createDatabase() {
  let connection;

  try {
    // connection = await mysql.createConnection({
    //   host: "recipe-app.cyclic.app",
    //   user: "joe",
    //   password: "sqlpassword",
    // });

    connection = await mysql.createConnection({
      host: "gateway01.us-east-1.prod.aws.tidbcloud.com",
      port: 4000,
      user: "3Acn8QAwBVJorbf.root",
      password: "Dr0xuKIuTdgNiCTl",
      ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      },
    });

    // Delete old database
    await connection.query("DROP DATABASE IF EXISTS recipe_app");

    // Create the database
    await connection.query("CREATE DATABASE IF NOT EXISTS recipe_app");

    // Use the database
    await connection.query("USE recipe_app");

    // Create the Recipe table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Recipes (
          recipe_id INT PRIMARY KEY AUTO_INCREMENT,
          recipe_name VARCHAR(255),
          time_to_cook VARCHAR(255)
        )
      `);

    // Create the Ingredient table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Ingredients (
          ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
          ingredient_name VARCHAR(255),
          ingredient_amount INT,
          ingredient_units VARCHAR(255)
          recipe_id INT,
          FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id) ON DELETE CASCADE
        )
      `);

    // Create the Instruction table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Instructions (
          instruction_id INT PRIMARY KEY AUTO_INCREMENT,
          instruction_text TEXT,
          recipe_id INT,
          FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id) ON DELETE CASCADE
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
