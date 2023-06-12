function splitIngredientString(ingredientString) {
  let name = "";
  let amount = "";
  let units = "";

  // each character before the first letter or space is the amount
  // the next word is the units
  // everything remaining is the name

  const letterOrSpace = /[a-zA-Z ]/g;
  let unitsDone = false;

  ingredientString.forEach((char) => {
    if (!letterOrSpace.test(char)) {
      amount += char;
      return;
    }

    if (!unitsDone) {
      if (char !== " ") {
        units += char;
        return;
      } else {
        unitsDone = true;
        return;
      }
    }

    name += char;
  });

  return [name, amount, units];
}

module.exports = splitIngredientString;
