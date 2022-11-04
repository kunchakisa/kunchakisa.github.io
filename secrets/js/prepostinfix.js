"use strict"
{
  let spacedModeInput = document.getElementById("option-spaced");
  let fieldInfix   = document.getElementById("field-infix");
  let fieldPostfix = document.getElementById("field-postfix");
  let fieldPrefix  = document.getElementById("field-prefix");
  let fieldEval    = document.getElementById("field-eval");
  let errorDiv     = document.getElementById("field-error");

  let parseAfter = 0;

  function updateParseCooldown () {
    parseAfter = Date.now() + 1000;
  }

  fieldInfix.addEventListener("keydown change", updateParseCooldown);
  fieldPostfix.addEventListener("keydown change", updateParseCooldown);
  fieldPrefix.addEventListener("keydown change", updateParseCooldown);

  let lastInfix = "",
    lastPostfix = "",
    lastPrefix = "",
    lastSpacedMode = false;
  let intervalControlNumber = setInterval(() => {
    if (Date.now() > parseAfter) {
      // Check if fields have changed, then compute output based
      // on what changed
      if (lastSpacedMode !== spacedModeInput.checked || fieldInfix.value !== lastInfix) {
        lastInfix = fieldInfix.value;
        clearFieldBorders();
        fieldInfix.classList.add("border-primary");
        let optionalResults = {};
        let postfix = toPostfix(fieldInfix.value, spacedModeInput.checked, optionalResults);
        if (typeof postfix !== "string") {
          errorDiv.classList.add("text-danger");
          errorDiv.innerText = postfix.message;
        } else {
          if (optionalResults.status !== "success") {
            if (optionalResults.status === "warning")
              errorDiv.classList.add("text-warning");
            let msg = "";
            for (let key in optionalResults.tallies) {
              let value = optionalResults.tallies[key];
              if (value > 0) {
                if (msg.length > 0) msg += " ";
                msg += `${value} case of "${key}"`;
              }
            }
            errorDiv.innerText = msg;
          }
          fieldPostfix.value = lastPostfix = postfix;
        }
      } else if (fieldPostfix.value !== lastPostfix) {

      } else if (fieldPrefix.value !== lastPrefix) {

      }
      lastSpacedMode = spacedModeInput.value;
    }
  }, 500);

  function clearFieldBorders () {
    fieldInfix.classList.remove("border-primary");
    fieldPostfix.classList.remove("border-primary");
    fieldPrefix.classList.remove("border-primary");
    errorDiv.classList.remove("text-danger", "text-warning");
    errorDiv.innerText = "None";
  }
}

function getOperatorPrecedence(operator) {
  if (operator === "-" || operator === "+")
    return 0;
  if (operator === "*" || operator === "/")
    return 1;
  if (operator === "^")
    return 2;
  return -1;
}
function isOperatorCommutative(operator) {
  if (operator === "+" || operator === "*")
    return true;
  return false;
}

/**
 * Launch function to convert infix to postfix
 * @param {string} infixExpression - the infix expression that follows the spaced mode
 * @param {{}} optionalResults 
 * @returns {string | {}} - the postfix expression or the optionalResult if there's an error
 */
function toPostfix(infixExpression, spacedMode = false, optionalResults = {}) {
  let funcObj = {
    expr: infixExpression,
    i: 0,
    output: "",
    optionalResults: optionalResults,
    spacedMode: spacedMode,
    lastOutputType: "start",
  }
  optionalResults.status = "success";
  optionalResults.tallies = {
    bracketsWithSingleOperands: 0,
    nonreproducibleClauses: 0,
    commutativeClauses: 0
  }
  toPostfixI(funcObj);
  if (optionalResults.status === "error")
    return optionalResults;
  return funcObj.output;
}

// Recursion function of postfix
// Called at the start of the input, and every start
// of every clauses
// RETURNS the minimum precedence of the operator of the clause
// RETURNS -1 if there's just one operand
// RETURNS -2 if there's an error
function toPostfixI(fo, depth = 0) {
  let minimumPrecedence = -1;
  let lastClauseMinimumPrecedence = -1;
  let operatorStack = new ArrayStack();
  let mode = 0;

  for (; fo.i<fo.expr.length;fo.i++) {
    let to = fo.expr.charAt(fo.i);
    let precedence = getOperatorPrecedence(to);
    let isCommutative = isOperatorCommutative(to);

    if (to === " ") continue;
    if (mode === 0) {
      // Mode 0, Expects (, or operands
      if (to === "(") {
        // Parse inside clause until close
        fo.i++;
        lastClauseMinimumPrecedence = toPostfixI(fo, depth+1);
        // an error has occured, just return -2 again
        if (lastClauseMinimumPrecedence === -2) return -2;
      } else if (to === ")") {
        // close parenthesis received in mode 0
        // Throw an error
        fo.optionalResults.status = "error";
        fo.optionalResults.message = "Unexpected closing parenthesis";
        fo.optionalResults.position = fo.i;
        return -2;
      } else if (precedence === -1) {
        // The next text is a text or a number.
        // If in spacedMode, get all numbers and
        // text until a non alphanumeric is met
        if (fo.spacedMode) {
          let start = fo.i;
          let end = getWholeOperand(fo);
          addToOutput(fo, fo.expr.substring(start, end), "operand");
        } else addToOutput(fo, to, "operand");
        lastClauseMinimumPrecedence = -1;
      } else {
        // operand input received in mode 0
        // Throw an error
        fo.optionalResults.status = "error";
        fo.optionalResults.message = "Unexpected operator";
        fo.optionalResults.position = fo.i;
        return -2;
      }
      // (...) expects operator after
      // ... as well
      mode = 1;
    } else {
      // Mode 1, expects ), or operators
      if (to === ")") {
        if (depth === 0) {
          // Throw an error if clause was closed without
          // matching open parenthesis
          fo.optionalResults.status = "error";
          fo.optionalResults.message = "Closing parenthesis found without matching "
            + "opening parenthesis";
          fo.optionalResults.position = fo.i;
          return -2;
        } else if (minimumPrecedence === -1) {
          // Throw a warning if clause was closed with just
          // one operand inside. This is a nonreproducible clause
          fo.optionalResults.status = "warning";
          fo.optionalResults.tallies.bracketsWithSingleOperands++;
        } else {
          postfixCheckWarnings(fo, operatorStack, lastClauseMinimumPrecedence, precedence);
          addOperatorStackToOutput(fo, operatorStack);
        }
        // Close this depth and return
        return minimumPrecedence;
      } else if (precedence !== -1) {
        // The character is an operator
        postfixCheckWarnings(fo, operatorStack, lastClauseMinimumPrecedence, precedence);
        if (!operatorStack.isEmpty() && precedence <= operatorStack.peek().precedence)
            addOperatorStackToOutput(fo, operatorStack, precedence);
        operatorStack.push({
          operator: to,
          precedence: precedence,
          isCommutative: isCommutative
        });
        if (minimumPrecedence === -1 || minimumPrecedence > precedence)
          minimumPrecedence = precedence;
      } else {
        // Mode 0 input received in mode 1
        // Throw an error
        fo.optionalResults.status = "error";
        if (to === "(") fo.optionalResults.message = "Unexpected opening parenthesis";
        else fo.optionalResults.message = "Unexpected operand";
        fo.optionalResults.position = fo.i;
        return -2;
      }
      mode = 0;
    }
  }
  if (depth !== 0) {
    // Throw an error if clause was closed without
    // matching open parenthesis
    fo.optionalResults.status = "error";
    fo.optionalResults.message = "End of input with missing "
      + "closing parenthesis";
    fo.optionalResults.position = fo.i;
    return -2;
  }
  if (fo.output.length > 0) {
    if (mode === 0) {
      // Throw an error if input is non-empty and
      // ends with an operator
      fo.optionalResults.status = "error";
      fo.optionalResults.message = "Input ends with an operator";
      fo.optionalResults.position = fo.i;
      return -2;
    }
    if (minimumPrecedence === -1) {
      // Throw a warning. The input consists of only one operand
      // and not empty
      fo.optionalResults.status = "warning";
      fo.optionalResults.tallies.bracketsWithSingleOperands++;
    } else {
      postfixCheckWarnings(fo, operatorStack, lastClauseMinimumPrecedence, -1);
      addOperatorStackToOutput(fo, operatorStack);
    }
  }
  return minimumPrecedence;
}

// ===================================
//  Utility functions
// ===================================

/**
 * Utility: Check infix 
 * @param {{}} fo - function object 
 * @param {*} operatorStack 
 * @param {*} lastClauseMinimumPrecedence 
 * @param {*} precedence 
 */
function postfixCheckWarnings(fo, operatorStack, lastClauseMinimumPrecedence, precedence) {
  if (operatorStack.isEmpty()) {
    if (lastClauseMinimumPrecedence >= precedence) {
      // Throw a warning if last clause precedence is at least the 
      // operator's precedence, it is a nonreproducible clause
      fo.optionalResults.status = "warning";
      fo.optionalResults.tallies.nonreproducibleClauses++;
    }
  } else {
    let lastOperator = operatorStack.peek();
    // Log that the last clause is not necessary and
    // does not affect the evaluation of values because
    // the operators are commutative and orders of operation
    // implies that the clause is unnecessary, but the output
    // can reproduce the clauses
    if (lastClauseMinimumPrecedence === lastOperator.precedence &&
        (lastClauseMinimumPrecedence >= precedence) &&
        lastOperator.isCommutative) {
      if (fo.optionalResults.status === "success") fo.optionalResults.status = "log";
      fo.optionalResults.tallies.commutativeClauses++;
    } else if (lastClauseMinimumPrecedence > lastOperator.precedence
        && lastClauseMinimumPrecedence >= precedence) {
      if (fo.optionalResults.status === "success") fo.optionalResults.status = "log";
      fo.optionalResults.tallies.commutativeClauses++;
    }
  }
}

// util: Get the index of the last character of an operand
function getWholeOperand(fo) {
  for (; fo.i<fo.expr.length;fo.i++) {
    let to = fo.expr.charAt(fo.i);
    let precedence = getOperatorPrecedence(to);
    if (to === "(" || to === ")" || precedence !== -1)
      break;
  }
  return fo.i--;
}

// util: Append the operatorStack to the string output
// Used in postfix conversion
function addOperatorStackToOutput(fo,  operatorStack, precedence = -1) {
  while (!operatorStack.isEmpty() && operatorStack.peek().precedence >= precedence)
    addToOutput(fo, operatorStack.pop().operator, "operator");
}

// util: Append to the text to the output with regards
// to spacedMode
function addToOutput(fo, toAdd, outputType) {
  if (!fo.spacedMode || fo.lastOutputType === "start" || !(fo.lastOutputType === "operand" && fo.lastOutputType === outputType)) fo.output += toAdd;
  else fo.output += " " + toAdd;
  fo.lastOutputType = outputType;
}

class ArrayStack {
  constructor () {
    this._array = [];
    this._length = 0;
  }
  peek() {
    return this._array[this._length-1];
  }
  isEmpty() {
    return this._length === 0;
  }
  pop() {
    this._length--;
    return this._array.pop();
  }
  get length() {
    return this._length;
  }
  push(...elems) {
    this._length += elems.length;
    return this._array.push(...elems);
  }
}