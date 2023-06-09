const connection = require("./connection");

// Get all recipes
async function getAllRecipes() {
  try {
    const [rows] = await connection.execute("SELECT * FROM Recipe");
    return rows;
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    throw error;
  }
}

// Insert a new recipe
async function createRecipe(recipeData) {
  try {
    console.log("pre-result");
    // Insert recipe data into the Recipe table
    const [result] = await connection.execute(
      "INSERT INTO Recipe (recipe_name, time_to_cook) VALUES (?, ?)",
      [recipeData.name, recipeData.timeToCook]
    );
    console.log(result);
    const recipeId = result.insertId;

    // Insert ingredients into the Ingredients table
    for (const ingredient of recipeData.ingredients) {
      await connection.execute(
        "INSERT INTO Ingredients (recipe_id, ingredient_name) VALUES (?, ?)",
        [recipeId, ingredient]
      );
    }

    // Insert instructions into the Instructions table
    for (const instruction of recipeData.instructions) {
      await connection.execute(
        "INSERT INTO Instructions (recipe_id, instruction_text) VALUES (?, ?)",
        [recipeId, instruction]
      );
    }

    return recipeId;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
}

// Get a recipe by ID
async function getRecipeById(recipeId) {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM Recipe WHERE id = ?",
      [recipeId]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    throw error;
  }
}

// Update a recipe
async function updateRecipe(recipeId, recipeData) {
  try {
    await connection.execute(
      "UPDATE Recipe SET recipe_name = ?, time_to_cook = ? WHERE id = ?",
      [recipeData.name, recipeData.timeToCook, recipeId]
    );
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
}

// Delete a recipe
async function deleteRecipe(recipeId) {
  try {
    await connection.execute("DELETE FROM Recipe WHERE id = ?", [recipeId]);
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
}

module.exports = {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
