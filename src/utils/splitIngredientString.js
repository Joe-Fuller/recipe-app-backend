function splitIngredientString(ingredientString) {
  let name = "";
  let amount = "";
  let units = "";

  // special case: 'a pinch'
  if (ingredientString.split(" ").slice(0, 2).join(" ") === "a pinch") {
    amount = "1";
    units = "pinch";
    name = ingredientString.slice(7, ingredientString.length - 1);
    return [name, amount, units];
  }

  // each character before the first letter is the amount
  // the next word is the units
  // everything remaining is the name

  const re = /[a-z ,.]/i;

  // the amount is the bit before the regex match
  let pos = ingredientString.search(re);
  amount = ingredientString.slice(0, pos);

  // split the string with the amount removed into words
  let remainingWords = ingredientString.slice(pos).trim().split(" ");

  // the first word is the units
  units = remainingWords[0].trim();

  // the remainder is the name
  name = remainingWords.slice(1).join(" ").trim();

  return [name, amount, units];
}

module.exports = splitIngredientString;
