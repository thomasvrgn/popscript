/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/

export default class Word {

    public exec (token   : string        = '', 
                 value   : string        = '', 
                 context : Array<string> = [], 
                 specs) 
    {

        if (!specs.variables[value]) {
            specs.variables[value] = {
                type: ''
            }
        }

        if (context.includes('FUNCTION::DECLARE')) {
            context.pop()
            context.push('FUNCTION::ARGUMENTS')

            return value + ' = function ('
        } else if (context.includes('FUNCTION::ARGUMENTS')) {

            return value
        }

        return

    }

}