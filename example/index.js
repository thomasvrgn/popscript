function factorial(a) {
    return a > 1 && (a *= factorial(a - 1, factorial(5))), a
}
console.log(factorial(5));