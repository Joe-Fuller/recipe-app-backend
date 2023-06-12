function splitIngredientString(ingredientString) {
  let name = "";
  let amount = "";
  let units = "";

  // each character before the first letter is the amount
  // the next word is the units
  // everything remaining is the name

  const re = /[a-z ,.]/i;

  let pos = ingredientString.search(re);
  amount = ingredientString.slice(0, pos);

  let remainingWords = ingredientString.slice(pos).split(" ");

  units = remainingWords[0];

  name = remainingWords.slice(1).join(" ");

  return [name, amount, units];
}

module.exports = splitIngredientString;
