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

const combineTime = (prepTime, cookTime) => {
  // Regular expression to extract hours and minutes from time strings
  const timeRegex = /PT(\d+H)?(\d+M)?/;

  // Extract hours and minutes from prep time
  const prepTimeMatch = prepTime.match(timeRegex);
  const prepHours = prepTimeMatch[1] ? parseInt(prepTimeMatch[1]) : 0;
  const prepMinutes = prepTimeMatch[2] ? parseInt(prepTimeMatch[2]) : 0;

  // Extract hours and minutes from cook time
  const cookTimeMatch = cookTime.match(timeRegex);
  const cookHours = cookTimeMatch[1] ? parseInt(cookTimeMatch[1]) : 0;
  const cookMinutes = cookTimeMatch[2] ? parseInt(cookTimeMatch[2]) : 0;

  // Calculate total hours and minutes
  const totalHours = prepHours + cookHours;
  const totalMinutes = prepMinutes + cookMinutes;

  // Format the combined time
  let timeString = "";
  if (totalHours > 0) {
    timeString += `${totalHours}H`;
  }
  if (totalMinutes > 0) {
    timeString += ` ${totalMinutes}M`;
  }

  return timeString.trim();
};

// Function to find the script tag with the desired schema
function findScriptWithSchema($) {
  // Find all script tags on the page
  const scriptTags = $("script");

  // Iterate over each script tag
  for (let i = 0; i < scriptTags.length; i++) {
    console.log(i);
    const scriptContent = $(scriptTags[i]).html();

    // It just looks for recipeInstructions, should be specific enough
    try {
      const schema = JSON.parse(scriptContent);

      console.log(schema);
      console.log("and the graph ================");
      console.log(schema["@graph"]);

      if (schema && schema.recipeInstructions) {
        console.log("made it through");
        // Check if the script has the desired properties
        // You can add your specific condition here
        return scriptContent;
      }

      console.log("post search");
    } catch (error) {
      // Ignore if the script content is not valid JSON
    }
  }

  return null;
}

async function scrapeRecipeFromUrl(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // Select the script element with the data-testid attribute
    const scriptElement = $('script[data-testid="page-schema"]');
    console.log(scriptElement);

    const script = findScriptWithSchema($);
    // console.log(script);

    // Extract the JSON string from the script element
    const jsonString = scriptElement.text();

    // Parse the JSON string into an object
    const recipeData = JSON.parse(jsonString);

    console.log(jsonString);

    // Access the recipe data
    const recipeName = recipeData.name;
    const recipeImage = recipeData.image.url;
    const recipeIngredients = recipeData.recipeIngredient;
    const recipeInstructions = recipeData.recipeInstructions;
    const recipeTime = combineTime(recipeData.prepTime, recipeData.cookTime);

    // Extract ingredients
    const ingredients = [];
    recipeIngredients.forEach((ingredient) => {
      ingredients.push(splitIngredientString(ingredient));
    });

    const aggregatedIngredients = aggregateIngredientAmounts(ingredients);

    // Format instructions
    const formattedInstructions = [];
    recipeInstructions.forEach((instruction) => {
      formattedInstructions.push(instruction.text);
    });

    // Create the recipe object
    const recipe = {
      name: recipeName,
      timeToCook: recipeTime,
      ingredients: aggregatedIngredients,
      instructions: formattedInstructions,
      imageLink: recipeImage,
    };

    return recipe;
  } catch (error) {
    console.error("Error scraping recipe:", error);
    return null;
  }
}

module.exports = scrapeRecipeFromUrl;
