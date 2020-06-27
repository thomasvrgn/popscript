function factorial(o) {
    return o > 1 && (o *= factorial(o - 1)), o
}
console.log(factorial(5));