const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeRecipeFromUrl(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // Extract recipe information
    const recipeName = $("h1").text();

    // Extract time to cook
    console.log("time to cook: time property");
    const timeToCook = $("time").text();
    $("time").each((index, element) => {
      console.log(element.attribs);
    });

    // Extract ingredients
    const ingredients = [];
    $(".recipe_ingredients").each((index, element) => {
      const ingredient = $(element).text().trim();
      ingredients.push(ingredient);
    });

    console.log("ingredients: ingredients class - .root.0.children");
    console.log($(".recipe_ingredients.root.0.children"));

    // Extract instructions
    const instructions = [];
    $(".recipe_method-steps").each((index, element) => {
      const instruction = $(element).text().trim();
      instructions.push(instruction);
    });

    console.log("instructions");
    console.log($(".recipe_method-steps"));

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
