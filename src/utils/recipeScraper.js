const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeRecipeFromUrl(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // Extract recipe information
    const recipeName = $("h1").text();
    const timeToCook = $("time").text();

    console.log("time to cook: time property");
    console.log($("time"));

    // Extract ingredients
    const ingredients = [];
    $(".recipe_ingredients").each((index, element) => {
      const ingredient = $(element).text().trim();
      ingredients.push(ingredient);
    });

    console.log("ingredients: ingredients class");
    console.log($(".recipe_ingredients"));

    // Extract instructions
    const instructions = [];
    $(".recipe_method-steps").each((index, element) => {
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

    console.log("Recipe Data: recipeScraper.js line 37");
    console.log(recipeData);

    return recipeData;
  } catch (error) {
    console.error("Error scraping recipe:", error);
    return null;
  }
}

module.exports = scrapeRecipeFromUrl;
