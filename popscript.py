# POPSCRIPT
# - By: Ness
# - Version: 1.0.0

import re

tokens = {
  'COMMENT_INLINE': '--'
}
class PS:
  
  def __init__ (self):
    self.file     = 'tests/index.ps'
    self.posX     = -1
    self.posY     = 1
    self.cur_char = ''
    self.status   = 'S_FREE'
    self.future_free = False

  def parse (self):

    file = open(self.file).read().split('\n')
    
    if file[0] == 'POPSCRIPT':
      for line in file:
        line_split = re.split('', line)[1:len(re.split('', line)) - 1]
        comment = []
        if len(line_split) == 0:
          self.posX = -1
          self.posY += 1
          self.cur_char = ''
        else:
          for char in line_split:
            self.posX += 1
            self.cur_char = line_split[self.posX]
            if self.future_free:
              self.status = 'S_FREE'
              self.future_free = False
            if self.posX + 1 == len(line_split):
              self.posX = -1
              self.posY += 1
              self.cur_char = ''
              if self.status == 'S_COMMENT_INLINE':
                self.future_free = True
            
            # Comments parsing
            if self.status == 'S_COMMENT_INLINE':
              comment.append(char)
            if line_split[self.posX] == tokens['COMMENT_INLINE'][0]:
              if line_split[self.posX + 1] == tokens['COMMENT_INLINE'][1]:
                self.status = 'S_COMMENT_INLINE'
                comment.append(char)

            # print(verify)
            print(char, self.status)
        print('================================================') 

popscript = PS()

popscript.parse()
