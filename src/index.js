function eval() {
  // Do not use eval!!!
  return;
}

module.exports = {
  expressionCalculator,
};

function expressionCalculator(expr) {
  const calculateExp = (string) => {

    string = string.replace("--", "+");
    string = string.replace("++", "+");
    string = string.replace("-+", "-");
    string = string.replace("+-", "-");

    let operatorIndexsArray = [...string.substring(1, string.length)]
      .map((el, i) => (el.search(/[\*\//+-]/) ? "" : i))
      .filter((el) => el !== "")
      .map((index) => (string[index + 1].search(/[\*\/]/) > -1 ? { i: index + 1, first: true } : { i: index + 1, first: false }))
      .filter(
        (el, i, array) =>
          !(
            !el.first &&
            ((array[i + 1] && array[i + 1].first && array[i + 1].i === el.i + 1) || (array[i - 1] && array[i - 1].first && array[i - 1].i === el.i - 1))
          )
      );

    if (operatorIndexsArray.length === 1) {
      let a = string.substring(0, operatorIndexsArray[0].i);
      let b = string.substring(operatorIndexsArray[0].i + 1);
      switch (string[operatorIndexsArray[0].i]) {
        case "*":
          return a * 1 * b * 1;
        case "/":
          if (b !== "0") {
            return (a * 1) / (b * 1);
          } else {
            throw new Error("TypeError: Division by zero.");
          }
        case "+":
          return a * 1 + b * 1;
        case "-":
          return a * 1 - b * 1;
      }
    } else if (operatorIndexsArray.length > 1) {
      let firstOrderIndex = operatorIndexsArray.findIndex((el) => el.first);
      let secondOrderIndex = operatorIndexsArray.findIndex((el) => !el.first);
      let solveIndex = -1;
      if (firstOrderIndex === -1) {
        solveIndex = secondOrderIndex;
      } else {
        solveIndex = firstOrderIndex;
      }
      if (solveIndex > -1) {
        let leftB = "";
        let rightB = "";
        let left = "";
        if (solveIndex > 0) {
          left = string.substring(operatorIndexsArray[solveIndex - 1].i + 1, operatorIndexsArray[solveIndex].i);
          leftB = string.substring(0, operatorIndexsArray[solveIndex - 1].i + 1);
        } else {
          left = string.substring(0, operatorIndexsArray[solveIndex].i);
        }
        let right = "";
        if (operatorIndexsArray.length - 1 > solveIndex) {
          right = string.substring(operatorIndexsArray[solveIndex].i + 1, operatorIndexsArray[solveIndex + 1].i);
          rightB = string.substring(operatorIndexsArray[solveIndex + 1].i, string.length);
        } else {
          right = string.substring(operatorIndexsArray[solveIndex].i + 1, string.length);
        }

        let action = string[operatorIndexsArray[solveIndex].i];

        let result = calculateExp(
          String(left) +
          String(action) +
          String(right)
        );
        result = calculateExp(leftB + result.toFixed(100) + rightB);

        return result;
      }
    } else {
      return string;
    }
  };

  const brakeBrackets = (string) => {
    if ((string.match(/\(/g) || []).length === (string.match(/\)/g) || []).length) {
      let iLeft = string.indexOf("(");
      let netxLeft = string.indexOf("(", iLeft + 1);
      let iRigth = string.indexOf(")", iLeft + 1);
      if (iLeft === -1) {
        return calculateExp(string);
      } else {
        let leftB = "";
        let left = "";

        let rigthB = "";
        let rigth = "";

        if (netxLeft > iRigth || netxLeft === -1) {
          leftB = string.substring(0, iLeft);
          rigthB = string.substring(iRigth + 1, string.length);
        } else {
          let bracketsIndexArray = [];
          [...string].forEach((element, i) => {
            if (element === "(") {
              let netxLeft = string.indexOf("(", i + 1);
              let iRigth = string.indexOf(")", i + 1);
              if (netxLeft > iRigth) {
                return;
              } else {
                bracketsIndexArray.push(i);
              }
            }
          });
          iRigth = string.indexOf(")", bracketsIndexArray[bracketsIndexArray.length - 1]);
          iLeft = bracketsIndexArray[bracketsIndexArray.length - 1];
          leftB = string.substring(0, iLeft);
          rigthB = string.substring(iRigth + 1, string.length);
        }
        left = brakeBrackets(string.substring(iLeft + 1, iRigth));
        result = brakeBrackets(leftB + String(left) + rigthB);
        return result;
      }
    } else {
      throw new Error("ExpressionError: Brackets must be paired");
    }
  };
  return brakeBrackets(expr.replace(/ /g, ""));
}