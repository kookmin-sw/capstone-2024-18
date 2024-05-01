import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class NasolabialEyebrow(PartType):
    def __init__(self):
        super().__init__()
        self.name="팔자눈썹"
        self.description="팔자눈썹은~"
        self.tag=[]

    def analyze(self, landmarks_mash,landmark_1000):

        bottom_head_y = (landmarks_mash[285][1] + landmarks_mash[295][1])/2
        bottom_head_x = landmarks_mash[285][0]

        bottom_mid_y = landmarks_mash[282][1]
        bottom_mid_x = landmarks_mash[282][0]

        bottom_tail_y = landmarks_mash[300][1]
        bottom_tail_x = landmarks_mash[300][0]

        if bottom_head_y >= bottom_tail_y : 
            if bottom_tail_y / bottom_head_y >= 99:
                return False
            else:
                return False
        else:
            return True
