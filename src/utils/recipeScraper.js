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
    let hours = 0;
    let minutes = 0;
    $("time").each((index, element) => {
      const durationString = element.attribs.datetime;
      const durationMatch = durationString.match(/PT(\d+)H(\d+)M/);
      hours += parseInt(durationMatch[1]);
      minutes += parseInt(durationMatch[2]);
    });
    const timeToCook = `${hours} hours ${minutes} minutes`;

    // Extract ingredients
    const ingredients = [];
    $("[data-component='IngredientsList'] > section > ul > li").each(
      (index, element) => {
        const ingredient = $(element).text().trim();
        ingredients.push(ingredient);
      }
    );

    // Extract instructions
    const instructions = [];
    $("[data-placement='MethodList'] > div > ul > li > div > p").each(
      (index, element) => {
        console.log(element);
        const instruction = $(element).text().trim();
        instructions.push(instruction);
      }
    );

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
