/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Addon
//////////////////////////////////*/

import {Token}       from '../scanner'

export default class Word {

    public exec (token   : string        = '', 
                 value   : string        = '', 
                 context : Array<string> = [], 
                 specs,
                 tokens  : Array<Token>  = [],
                 index   : number        = 0,
                 built   : Array<string> = []) 
    {

        if (!specs.variables[value]) {
            specs.variables[value] = {
                type: ''
            }
        }

        specs.current.variable = value

        if (context.includes('FUNCTION::DECLARE')) {
            context.pop()
            context.push('FUNCTION::ARGUMENTS')
            specs.variables[value].type = 'function'

            return value + '.value = function ('
        } else if (context.includes('FUNCTION::ARGUMENTS')) {
            const remaining = tokens.slice(index + 1).filter(x => !['SPACE', 'TABS'].includes(x.token))

            if (remaining.length > 0) {
                return value + ', '
            } else {
                return value + '):'
            }
        } else if (context.includes('LOOP::ARRAY')) {
            return value + '):'
        } else if (context.includes('ALIASE::DECLARE')) {
            specs.variables[value].type = 'aliase'
        } else if (context.includes('ALIASE::FUNCTION')) {
            context.pop()
            specs.variables[Object.keys(specs.variables).slice(-1)[0]]['aliase'] = value
        } else if (specs.variables[value] && specs.variables[value].type === 'aliase') {
            context.push('FUNCTION::CALL')
            const remaining = tokens.slice(index + 3, (tokens.findIndex(x => x.token === 'AFTER') === -1 ? tokens.length : tokens.findIndex(x => x.token === 'AFTER'))).filter(x => !['SPACE', 'TABS'].includes(x.token))

            return remaining.length > 0 ? specs.variables[value].aliase + '(' : specs.variables[value].aliase + '()'

        } else if (specs.variables[value] && specs.variables[value].type === 'function') {
            context.push('FUNCTION::CALL')
            const remaining = tokens.slice(index + 3, (tokens.findIndex(x => x.token === 'AFTER') === -1 ? tokens.length : tokens.findIndex(x => x.token === 'AFTER'))).filter(x => !['SPACE', 'TABS'].includes(x.token))

            return remaining.length > 0 ? value + '.value' + '(' : value + '.value' + '()'

        } else if (context.includes('FUNCTION::CALL')) {
            const remaining = tokens.slice(index + 3, (tokens.findIndex(x => x.token === 'AFTER') === -1 ? tokens.length : tokens.findIndex(x => x.token === 'AFTER'))).filter(x => !['SPACE', 'TABS'].includes(x.token))

            if (remaining.length > 0) {
                return value + ', '
            } else {
                context.pop()
                return value + ')'
            }

        } else if (context.includes('PROPERTY::DECLARE')) {
            context.pop()
            context.push('PROPERTY::ARGUMENTS')
            specs.variables[value].type = 'prototype'

            return value + '.value = function (self, '
        } else if (context.includes('PROPERTY::ARGUMENTS')) {
            const remaining = tokens.slice(index + 1).filter(x => !['SPACE', 'TABS'].includes(x.token))

            if (remaining.length > 0) {
                return value + ', '
            } else {
                return value + '):'
            }
        } else if (specs.variables[value] && specs.variables[value].type === 'prototype') {
            const built_copy = built[built.length - 1]
            built[built.length - 1] = value + '.value('
            built.push(built_copy)
            context.push('PROPERTY::CALL')
            const remaining = tokens.slice(index + 3, (tokens.findIndex(x => x.token === 'AFTER') === -1 ? tokens.length : tokens.findIndex(x => x.token === 'AFTER'))).filter(x => !['SPACE', 'TABS'].includes(x.token))
            return remaining.length > 0 ? ', ' :  + ')'
        } else if (context.includes('PROPERTY::CALL')) {
            const remaining = tokens.slice(index + 1, (tokens.findIndex(x => x.token === 'AFTER') === -1 ? tokens.length : tokens.findIndex(x => x.token === 'AFTER'))).filter(x => !['SPACE', 'TABS'].includes(x.token))

            if (remaining.length > 0) {
                return value + ', '
            } else {
                context.pop()
                return value + ')'
            }
        } else {
            const variable = tokens.slice(index + 1).filter(x => !['SPACE', 'TABS'].includes(x.token))[0]
            if (variable && specs.variables[variable.value] && specs.variables[variable.value].type.length > 0) {
                return value
            }
            return !context.includes('LOOP::DECLARE') ? value + '.value' : value
        }

    }

}