const mysql = require("mysql2/promise");
const axios = require("axios");
const cheerio = require("cheerio");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sqlpass",
  database: "recipe_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function scrapeRecipeFromUrl(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // Extract recipe information
    const recipeName = $("h1").text();
    const timeToCook = $(".cook-time").text();

    // Extract ingredients
    const ingredients = [];
    $(".ingredient").each((index, element) => {
      const ingredient = $(element).text().trim();
      ingredients.push(ingredient);
    });

    // Extract instructions
    const instructions = [];
    $(".instruction").each((index, element) => {
      const instruction = $(element).text().trim();
      instructions.push(instruction);
    });

    // Create the recipe data object
    const recipeData = {
      name: recipeName,
      timeToCook: timeToCook,
      ingredients: ingredients,
      instructions: instructions,
    };

    return recipeData;
  } catch (error) {
    console.error("Error scraping recipe:", error);
    return null;
  }
}

async function storeRecipeData(recipeData) {
  try {
    // Insert recipe information into the Recipe table
    const [recipeResult] = await connection.execute(
      "INSERT INTO Recipe (recipe_name, time_to_cook) VALUES (?, ?)",
      [recipeData.name, recipeData.timeToCook]
    );

    const recipeId = recipeResult.insertId;

    // Insert ingredients into the Ingredient table
    for (const ingredient of recipeData.ingredients) {
      await connection.execute(
        "INSERT INTO Ingredient (ingredient_name, recipe_id) VALUES (?, ?)",
        [ingredient, recipeId]
      );
    }

    // Insert instructions into the Instruction table
    for (const instruction of recipeData.instructions) {
      await connection.execute(
        "INSERT INTO Instruction (instruction_text, recipe_id) VALUES (?, ?)",
        [instruction, recipeId]
      );
    }

    console.log("Recipe data stored successfully");
  } catch (error) {
    console.error("Error storing recipe data:", error);
  }
}
