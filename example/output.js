function factorial(o) {
    return o > 1 && (o *= factorial(o - 1)), o
}

function welcome(o) {
    console.log("Welcome", o, "!")
}
console.log(factorial(5)), welcome("Ness");