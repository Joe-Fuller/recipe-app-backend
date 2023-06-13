const axios = require("axios");
const cheerio = require("cheerio");
const splitIngredientString = require("./splitIngredientString");

// Helper function to aggregate ingredient amounts
const aggregateIngredientAmounts = (ingredients) => {
  const aggregatedIngredients = [];
  const ingredientMap = new Map();

  for (const ingredient of ingredients) {
    const key = `${ingredient.name} ${ingredient.units}`;
    const existingIngredient = ingredientMap.get(key);

    if (existingIngredient) {
      console.log(ingredient.name + " already exists");
      existingIngredient.amount = (
        parseFloat(existingIngredient.amount) + parseFloat(ingredient.amount)
      ).toString();
    } else {
      console.log(ingredient.name + " does not exist");
      ingredientMap.set(key, {
        ...ingredient,
        amount: ingredient.amount,
      });
    }
  }

  for (const [, value] of ingredientMap) {
    aggregatedIngredients.push(value);
  }

  return aggregatedIngredients;
};

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
        const ingredientText = $(element).text().trim();
        ingredients.push(splitIngredientString(ingredientText));
      }
    );

    const aggregatedIngredients = aggregateIngredientAmounts(ingredients);

    // Extract instructions
    const instructions = [];
    $("[data-placement='MethodList'] > div > ul > li > div > p").each(
      (index, element) => {
        const instruction = $(element).text().trim();
        instructions.push(instruction);
      }
    );

    // Create the recipe data object
    const recipeData = {
      name: recipeName,
      timeToCook: timeToCook,
      ingredients: aggregatedIngredients,
      instructions: instructions,
    };

    return recipeData;
  } catch (error) {
    console.error("Error scraping recipe:", error);
    return null;
  }
}

module.exports = scrapeRecipeFromUrl;
