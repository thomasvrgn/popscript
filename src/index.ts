/*//////////////////////////////////
         POPSCRIPT LANGUAGE
                Main
//////////////////////////////////*/

import Transpiler from './core/transpiler';

new Transpiler('test = "world"\nprint "hello ::test::!"\nprint "hello" test').transpile()