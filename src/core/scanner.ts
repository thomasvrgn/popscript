/*//////////////////////////////////
         POPSCRIPT LANGUAGE
               Scanner
//////////////////////////////////*/

export interface Token {
    token      : string,
    value      : string,
    customOut? : any
}
function formatOutput (currentToken: string, tokenValue: string, tokenizer: any) {
    const output: Token = {
        token     : currentToken , 
        value     : tokenValue 
    }
    if (currentToken in tokenizer.customOut) output.customOut = tokenizer.customOut[currentToken]
    return output
}

function updateValues (tempArray: any, values: any, key: string) {
    if (tempArray !== null && (tempArray.index < values.startToken || 
        tempArray.index === values.startToken                      && 
        tempArray[0].length > values.endToken)) {

        values.startToken = tempArray.index
        values.tokenValue = tempArray[0]
        values.endToken   = tempArray[0].length
        values.currToken  = key
    }
    return values
}

function getNearestTok (tokens, string: string) {

    let values = {
        endToken   : 0                       ,
        startToken : Number.MAX_SAFE_INTEGER ,
        tokenValue : ''                      ,
        currToken  : ''                      ,
    }

    for (const key in tokens) {
        if (tokens.hasOwnProperty(key)) {
            const tempArray = string.match(tokens[key])
            values  = updateValues(tempArray, values, key)
        }
    }

    return values
}

export function scanner (string: string, tokenizer) {
    const tokens = tokenizer.tokens,
          token  = []

    while (string) {

        let { 
            endToken   , 
            startToken , 
            tokenValue , 
            currToken 
        } = getNearestTok(tokens, string)

        if (startToken !== 0) {
            tokenValue = string.substring(0, startToken)
            currToken  = tokenizer.errTok
            endToken   = startToken
        }

        if (!tokenizer.ignore[currToken]) token.push(formatOutput(currToken, tokenValue, tokenizer))
        if (currToken in tokenizer.functions) tokenizer.functions[currToken]()

        string = string.substring(endToken)
    }

    return token
}