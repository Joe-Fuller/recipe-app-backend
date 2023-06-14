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
      existingIngredient.amount = (
        parseFloat(existingIngredient.amount) + parseFloat(ingredient.amount)
      ).toString();
    } else {
      ingredientMap.set(key, {
        ...ingredient,
        amount: ingredient.amount.toString(),
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

    // Select the script element with the data-testid attribute
    const scriptElement = $('script[data-testid="page-schema"]');

    // Extract the JSON string from the script element
    const jsonString = scriptElement.text();

    // Parse the JSON string into an object
    const recipeData = JSON.parse(jsonString);

    console.log(Object.keys(recipeData));

    // Access the recipe data
    const recipeName = recipeData.name;
    const recipeImage = recipeData.image.url;
    const recipeTimeToCook = recipeData.name;
    const recipeIngredients = recipeData.recipeIngredient;
    const recipeInstructions = recipeData.recipeInstructions;

    console.log(recipeName);
    console.log(recipeImage);
    console.log(recipeIngredients);
    console.log(recipeInstructions);

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

    // Create the recipe object
    const recipe = {
      name: recipeName,
      timeToCook: timeToCook,
      ingredients: aggregatedIngredients,
      instructions: instructions,
      imageLink: imageLink,
    };

    return recipe;
  } catch (error) {
    console.error("Error scraping recipe:", error);
    return null;
  }
}

module.exports = scrapeRecipeFromUrl;
