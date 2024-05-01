import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class NasolabialEyebrow(PartType):
    def __init__(self):
        super().__init__()
        self.name="팔자눈썹"
        self.description="팔자눈썹을 가진 사람은 온화한 성격으로 대체로 애교가 많다. 자신보다 주위사람의 마음을 잘 챙겨주는 상냥한 성격을 가지고 있지만 주관이 뚜렷하고 확실하다."
        self.tag=["배려심","상냥함","당돌함"]

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
