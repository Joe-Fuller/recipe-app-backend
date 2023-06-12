const connection = require("./connection");

// Insert a new instruction
async function createInstruction(recipeId, instructionText) {
  try {
    await connection.execute(
      "INSERT INTO Instructions (instruction_text, recipe_id) VALUES (?, ?)",
      [instructionText, recipeId]
    );
  } catch (error) {
    console.error("Error creating instruction:", error);
    throw error;
  }
}

// Get instructions by recipe ID
async function getInstructionsByRecipeId(recipeId) {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM Instructions WHERE recipe_id = ?",
      [recipeId]
    );
    return rows;
  } catch (error) {
    console.error("Error retrieving instructions:", error);
    throw error;
  }
}

// Update an instruction
async function updateInstruction(instructionId, instructionText) {
  try {
    await connection.execute(
      "UPDATE Instructions SET instruction_text = ? WHERE id = ?",
      [instructionText, instructionId]
    );
  } catch (error) {
    console.error("Error updating instruction:", error);
    throw error;
  }
}

// Delete an instruction
async function deleteInstruction(instructionId) {
  try {
    await connection.execute("DELETE FROM Instructions WHERE id = ?", [
      instructionId,
    ]);
  } catch (error) {
    console.error("Error deleting instruction:", error);
    throw error;
  }
}

module.exports = {
  createInstruction,
  getInstructionsByRecipeId,
  updateInstruction,
  deleteInstruction,
};
