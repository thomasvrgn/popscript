# POPSCRIPT
# - By: Ness
# - Version: 1.0.0

import re

tokens = {
  'PRGM_START': r'POPSCRIPT',
  'CNDT_ELIF': r'elif',
  'CNDT_ELSE': r'else',
  'CNDT_IF': r'if',
  'CMT_INLINE': r'--(.*)',
  'VAR_DEFINE': r'def'
}
class PS:
  
  def __init__ (self):
    self.file     = 'tests/index.ps'
    self.posX     = -1
    self.posY     = 1
    self.status   = ''

  def parse (self):

    file = open(self.file).read().split('\n')
    for line in file:
      for token in tokens:
        matches = re.finditer(tokens.get(token), line, re.MULTILINE)
        for matchNum, match in enumerate(matches, start = 1):
          print(match)
          print(match.groups())
                  

     
popscript = PS()

popscript.parse()
