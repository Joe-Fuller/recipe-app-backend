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

  let remainingWords = ingredientString.slice(pos).trim().split(" ");

  console.log(remainingWords);

  units = remainingWords[0].trim();

  name = remainingWords.slice(1).join(" ").trim();

  return [name, amount, units];
}

module.exports = splitIngredientString;
