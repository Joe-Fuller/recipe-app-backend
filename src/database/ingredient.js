const connection = require("./connection");

// Insert a new ingredient
async function createIngredient(recipeId, ingredientName) {
  try {
    await connection.execute(
      "INSERT INTO Ingredients (ingredient_name, recipe_id) VALUES (?, ?)",
      [ingredientName, recipeId]
    );
  } catch (error) {
    console.error("Error creating ingredient:", error);
    throw error;
  }
}

// Get ingredients by recipe ID
async function getIngredientsByRecipeId(recipeId) {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM Ingredients WHERE recipe_id = ?",
      [recipeId]
    );
    return rows;
  } catch (error) {
    console.error("Error retrieving ingredients:", error);
    throw error;
  }
}

// Update an ingredient
async function updateIngredient(ingredientId, ingredientName) {
  try {
    await connection.execute(
      "UPDATE Ingredients SET ingredient_name = ? WHERE id = ?",
      [ingredientName, ingredientId]
    );
  } catch (error) {
    console.error("Error updating ingredient:", error);
    throw error;
  }
}

// Delete an ingredient
async function deleteIngredient(ingredientId) {
  try {
    await connection.execute("DELETE FROM Ingredients WHERE id = ?", [
      ingredientId,
    ]);
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    throw error;
  }
}

module.exports = {
  createIngredient,
  getIngredientsByRecipeId,
  updateIngredient,
  deleteIngredient,
};
