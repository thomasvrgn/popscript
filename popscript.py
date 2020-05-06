# POPSCRIPT
# - By: Ness
# - Version: 1.0.0

import re
class PS:
  
  def __init__ (self):
    self.file     = 'tests/index.ps'
    self.posX     = -1
    self.posY     = 1
    self.cur_char = ''
    self.status   = 'S_FREE'

  def parse (self):

    file = open(self.file).read().split('\n')
    
    if file[0] == 'POPSCRIPT':
      for line in file:
        line_split = re.split('', line)[1:len(re.split('', line)) - 1]
        if len(line_split) == 0:
          self.posX = -1
          self.posY += 1
          self.cur_char = ''
        else:
          for char in line_split:
            if len(line_split) != 0:
              self.posX += 1
              self.cur_char = line_split[self.posX]
              print(self.posX + 1, len(line_split), self.cur_char, self.posY)
              if self.posX + 1 == len(line_split):
                self.posX = -1
                self.posY += 1
                self.cur_char = ''
              

popscript = PS()

popscript.parse()