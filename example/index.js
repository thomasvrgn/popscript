var mod = require("./export");
mod.welcome("Ness");
var liste = ["test", "coucou", 5, ["bruh", 5]];
console.log(liste), liste.push("bruh"), console.log(liste[3][0]);