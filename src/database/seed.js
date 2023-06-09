const connection = require("./connection");

async function seed() {
  try {
    // Insert recipes
    await connection.execute(
      "INSERT INTO Recipe (recipe_name, time_to_cook) VALUES (?, ?)",
      ["Lasagna", 60]
    );
    await connection.execute(
      "INSERT INTO Recipe (recipe_name, time_to_cook) VALUES (?, ?)",
      ["Pizza", 45]
    );

    // Insert ingredients
    await connection.execute(
      "INSERT INTO Ingredient (ingredient_name) VALUES (?)",
      ["Tomatoes"]
    );
    await connection.execute(
      "INSERT INTO Ingredient (ingredient_name) VALUES (?)",
      ["Cheese"]
    );
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Close the connection
    connection.end();
  }
}

seed();
