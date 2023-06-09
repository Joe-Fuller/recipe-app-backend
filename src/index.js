const express = require("express");
const recipesRouter = require("./routes/recipes");
const ingredientsRouter = require("./routes/ingredients");
const instructionsRouter = require("./routes/instructions");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/recipes", recipesRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/instructions", instructionsRouter);

// Default route handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
