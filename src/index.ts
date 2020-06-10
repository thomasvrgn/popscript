/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Transpiler from './core/transpiler';

new Transpiler('print "hello world"\ntest = "coucou"').transpile()