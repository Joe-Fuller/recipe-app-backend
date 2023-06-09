const express = require("express");
const router = express.Router();
const {
  createIngredient,
  getIngredientsByRecipeId,
  updateIngredient,
  deleteIngredient,
} = require("../database/ingredient");

// Create a new ingredient
router.post("/", async (req, res) => {
  try {
    const ingredientId = await createIngredient(req.body);
    res
      .status(201)
      .json({ id: ingredientId, message: "Ingredient created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create ingredient" });
  }
});

// Get ingredients by recipe ID
router.get("/:recipeId", async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const ingredients = await getIngredientsByRecipeId(recipeId);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve ingredients" });
  }
});

// Update an ingredient
router.put("/:id", async (req, res) => {
  const ingredientId = req.params.id;
  try {
    await updateIngredient(ingredientId, req.body);
    res.json({ message: "Ingredient updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update ingredient" });
  }
});

// Delete an ingredient
router.delete("/:id", async (req, res) => {
  const ingredientId = req.params.id;
  try {
    await deleteIngredient(ingredientId);
    res.json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete ingredient" });
  }
});

module.exports = router;
