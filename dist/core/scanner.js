"use strict";
exports.__esModule = true;
exports.scanner = void 0;
function formatOutput(currentTok, tokenValue, tokenizer) {
    var output = {
        token: currentTok,
        value: tokenValue,
        customOut: String
    };
    if (currentTok in tokenizer.customOut)
        output.customOut = tokenizer.customOut[currentTok];
    return output;
}
function updateValues(tempArray, values, key) {
    if (tempArray !== null && (tempArray.index < values.startToken ||
        tempArray.index === values.startToken &&
            tempArray[0].length > values.endToken)) {
        values.startToken = tempArray.index;
        values.tokenValue = tempArray[0];
        values.endToken = tempArray[0].length;
        values.currToken = key;
    }
    return values;
}
function getNearestTok(tokens, string) {
    var values = {
        endToken: 0,
        startToken: Number.MAX_SAFE_INTEGER,
        tokenValue: '',
        currToken: ''
    };
    for (var key in tokens) {
        var tempArray = string.match(tokens[key]);
        values = updateValues(tempArray, values, key);
    }
    return values;
}
function scanner(string, tokenizer) {
    var tokens = tokenizer.tokens, token = [];
    while (string) {
        var _a = getNearestTok(tokens, string), endToken = _a.endToken, startToken = _a.startToken, tokenValue = _a.tokenValue, currToken = _a.currToken;
        if (startToken !== 0) {
            tokenValue = string.substring(0, startToken);
            currToken = tokenizer.errTok;
            endToken = startToken;
        }
        if (!tokenizer.ignore[currToken])
            token.push(formatOutput(currToken, tokenValue, tokenizer));
        if (currToken in tokenizer.functions)
            tokenizer.functions[currToken]();
        string = string.substring(endToken);
    }
    return token;
}
exports.scanner = scanner;
