const express = require("express");
const recipesRouter = require("./routes/recipes");
const ingredientsRouter = require("./routes/ingredients");
const instructionsRouter = require("./routes/instructions");
const cors = require("cors");

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/recipes", recipesRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/instructions", instructionsRouter);

// Default route handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

module.exports = app;
