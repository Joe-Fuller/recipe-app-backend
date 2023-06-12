function splitIngredientString(ingredientString) {
  let name = "";
  let amount = "";
  let units = "";

  // each character before the first letter or space is the amount
  // the next word is the units
  // everything remaining is the name

  const letterOrSpace = /[a-zA-Z ]/g;
  let unitsDone = false;

  ingredientString.split("").forEach((char) => {
    console.log(char, letterOrSpace.test(char));

    if (!letterOrSpace.test(char)) {
      console.log("its amount");
      amount += char;
      return;
    }

    if (!unitsDone) {
      if (char !== " ") {
        console.log("its units");
        units += char;
        return;
      } else {
        console.log("units done");
        unitsDone = true;
        return;
      }
    }
    console.log("its name");
    name += char;
  });

  return [name, amount, units];
}

module.exports = splitIngredientString;
