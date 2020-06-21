var fs = require("fs");

function callback(e, l) {
    e && console.log("Une erreur est survenue : " + e), console.log(l)
}
fs.readFile("export.ps", "UTF-8", callback);