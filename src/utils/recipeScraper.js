const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeRecipeFromUrl(url) {
  try {
    const response = await axios.get(url);
    console.log(response);
    const html = response.data;
    console.log(html);

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

module.exports = scrapeRecipeFromUrl;
