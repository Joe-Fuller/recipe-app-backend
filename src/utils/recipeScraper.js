const axios = require("axios");
const cheerio = require("cheerio");
const splitIngredientString = require("./splitIngredientString");
const he = require("he");

// Unit correlation mapping
const unitCorrelation = {
  tsp: ["tsp", "tsps", "teaspoon", "teaspoons"],
  tbsp: ["tbsp", "tbsps", "tablespoon", "tablespoons"],
  cup: ["cup", "cups"],
  // Add more unit correlations as needed
};

// Helper function to find the correlated unit for a given unit
function findCorrelatedUnit(unit) {
  for (const [baseUnit, correlatedUnits] of Object.entries(unitCorrelation)) {
    if (correlatedUnits.includes(unit.toLowerCase())) {
      return baseUnit;
    }
  }
  return unit; // If no correlation is found, return the original unit
}

// Helper function to add up ingredient amounts
function aggregateIngredientAmounts(ingredients) {
  const aggregatedIngredients = [];
  const ingredientMap = new Map();

  for (const ingredient of ingredients) {
    const key = `${ingredient.name} ${findCorrelatedUnit(ingredient.units)}`;
    const existingIngredient = ingredientMap.get(key);

    if (existingIngredient) {
      existingIngredient.amount = (
        parseFloat(existingIngredient.amount) + parseFloat(ingredient.amount)
      ).toString();
    } else {
      ingredientMap.set(key, {
        ...ingredient,

        amount: ingredient.amount.toString(),
        units: findCorrelatedUnit(ingredient.units),
      });
    }
  }

  for (const [, value] of ingredientMap) {
    aggregatedIngredients.push(value);
  }

  return aggregatedIngredients;
}

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
    const scriptContent = $(scriptTags[i]).text();

    // It just looks for recipeInstructions, should be specific enough
    try {
      const schema = JSON.parse(scriptContent);

      // Check if the script has the desired properties
      if (schema && schema.recipeInstructions) {
        return schema;
      } else if (schema && schema["@graph"]) {
        // Some are arranged weirdly
        // This searches them
        const graph = schema["@graph"];

        for (let j = 0; j < graph.length; j++) {
          if (graph[j] && graph[j].recipeInstructions) {
            return graph[j];
          }
        }
      }
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

    const recipeData = findScriptWithSchema($);

    // Access the recipe data and decode HTML entities
    const recipeName = he.decode(recipeData.name);
    let recipeImage = recipeData.image.url || recipeData.image;
    const recipeIngredients = recipeData.recipeIngredient.map((ingredient) =>
      he.decode(ingredient)
    );
    const recipeInstructions = recipeData.recipeInstructions.map(
      (instruction) => he.decode(instruction.text)
    );
    const recipeTime = combineTime(recipeData.prepTime, recipeData.cookTime);

    // Extract ingredients
    const ingredients = [];
    recipeIngredients.forEach((ingredient) => {
      ingredients.push(splitIngredientString(ingredient));
    });

    const aggregatedIngredients = aggregateIngredientAmounts(ingredients);

    // Make sure the image is a string, not an array
    if (Array.isArray(recipeImage)) {
      recipeImage = recipeImage[0];
    }

    // Create the recipe object
    const recipe = {
      name: recipeName,
      timeToCook: recipeTime,
      ingredients: aggregatedIngredients,
      instructions: recipeInstructions,
      imageLink: recipeImage,
    };

    return recipe;
  } catch (error) {
    console.error("Error scraping recipe:", error);
    return null;
  }
}

module.exports = scrapeRecipeFromUrl;
