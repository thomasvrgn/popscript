function factorial(o) {
    return o > 1 && (o *= factorial(o - 1)), o
}
for (var i in console.log(factorial(5)), factorial(10)) console.log("test");