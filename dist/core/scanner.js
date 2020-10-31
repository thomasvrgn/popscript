"use strict";
exports.__esModule = true;
exports.getNearestToken = exports.updateValues = exports.formatOutput = void 0;
function formatOutput(currentToken, tokenValue, tokenizer) {
    var output = {
        token: currentToken,
        value: tokenValue
    };
    if (currentToken in tokenizer.customOut)
        output.customOut = tokenizer.customOut[currentToken];
    return output;
}
exports.formatOutput = formatOutput;
function updateValues(tempArray, values, key) {
    var tmpValues = values;
    var arrayFirstElement = tempArray[0];
    if (tempArray !== null
        && (tempArray.index < values.startToken || (tempArray.index === values.startToken
            && tempArray[0].length > values.endToken))) {
        tmpValues.startToken = tempArray.index;
        tmpValues.tokenValue = arrayFirstElement;
        tmpValues.endToken = arrayFirstElement.length;
        tmpValues.currToken = key;
    }
    return values;
}
exports.updateValues = updateValues;
function getNearestToken(tokens, string) {
    var values = {
        endToken: 0,
        startToken: Number.MAX_SAFE_INTEGER,
        tokenValue: '',
        currToken: ''
    };
    Object.entries(tokens).map(function (x) {
        var tempArray = string.match(tokens[x[0]]);
        if (tempArray)
            values = updateValues(tempArray, values, x[0]);
        return true;
    });
    return values;
}
exports.getNearestToken = getNearestToken;
function scanner(string, tokenizer) {
    var tokens = tokenizer.tokens;
    var token = [];
    var tmpString = string;
    while (tmpString) {
        var _a = getNearestToken(tokens, tmpString), endToken = _a.endToken, tokenValue = _a.tokenValue, 
        // eslint-disable-next-line prefer-const
        startToken = _a.startToken, currToken = _a.currToken;
        if (startToken !== 0) {
            tokenValue = string.substring(0, startToken);
            currToken = tokenizer.errTok;
            endToken = startToken;
        }
        if (!tokenizer.ignore[currToken])
            token.push(formatOutput(currToken, tokenValue, tokenizer));
        if (currToken in tokenizer.functions)
            tokenizer.functions[currToken]();
        tmpString = tmpString.substring(endToken);
    }
    return token;
}
exports["default"] = scanner;
