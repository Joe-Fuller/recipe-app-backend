const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../database/recipe");

// Create a new recipe
router.post("/", async (req, res) => {
  try {
    const recipeId = await createRecipe(req.body);
    res
      .status(201)
      .json({ id: recipeId, message: "Recipe created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

// Get a recipe by ID
router.get("/:id", async (req, res) => {
  const recipeId = req.params.id;
  try {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
    } else {
      res.json(recipe);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve recipe" });
  }
});

// Update a recipe
router.put("/:id", async (req, res) => {
  const recipeId = req.params.id;
  try {
    await updateRecipe(recipeId, req.body);
    res.json({ message: "Recipe updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// Delete a recipe
router.delete("/:id", async (req, res) => {
  const recipeId = req.params.id;
  try {
    await deleteRecipe(recipeId);
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

module.exports = router;
