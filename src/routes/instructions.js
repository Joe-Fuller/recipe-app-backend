const express = require("express");
const router = express.Router();
const {
  createInstruction,
  getInstructionsByRecipeId,
  updateInstruction,
  deleteInstruction,
} = require("../database/instruction");

// Create a new instruction
router.post("/", async (req, res) => {
  try {
    const instructionId = await createInstruction(req.body);
    res
      .status(201)
      .json({ id: instructionId, message: "Instruction created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create instruction" });
  }
});

// Get instructions by recipe ID
router.get("/:recipeId", async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const instructions = await getInstructionsByRecipeId(recipeId);
    res.json(instructions);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve instructions" });
  }
});

// Update an instruction
router.put("/:id", async (req, res) => {
  const instructionId = req.params.id;
  try {
    await updateInstruction(instructionId, req.body);
    res.json({ message: "Instruction updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update instruction" });
  }
});

// Delete an instruction
router.delete("/:id", async (req, res) => {
  const instructionId = req.params.id;
  try {
    await deleteInstruction(instructionId);
    res.json({ message: "Instruction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete instruction" });
  }
});

module.exports = router;
