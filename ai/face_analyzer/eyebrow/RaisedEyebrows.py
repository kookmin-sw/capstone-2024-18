import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class RaisedEyebrows(PartType):
    def __init__(self):
        super().__init__()
        self.name="올라간 눈썹"
        self.description="올라간 눈썹을 가진 사람은 대체로 대담하고 강한 성품을 가지고 있는 경향이 있다. 다소 극단적일 수 있지만 내 사람에게는 가정적이고 따뜻한 면모를 가진다."
        self.tag=["대담함","가정적임"]

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
                return True
        else:
            return False
