var mod = {};

function factorial(o) {
    return o > 1 && (o *= factorial(o - 1)), o
}
mod.welcome = function(o) {
    console.log("Welcome", o, "!")
}, console.log(factorial(5)), mod.welcome("Ness");