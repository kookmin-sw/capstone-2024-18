import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class StraightEyebrow(PartType):
    def __init__(self):
        super().__init__()
        self.name="일자 눈썹"
        self.description="일자눈썹을 가진 사람은 원칙을 중요시하며 사회의 변화나 주위 시선에 크게 신경쓰지 않는 경향이 있다. 목표를 향해 성실하게 임하는 성격으로 부지런한 생활 습관을 가지고 있다. 또한 거짓말을 잘 못해 자신의 감정에 솔직한 편이다."
        self.tag=["성실함","솔직함","부지런함"]

    def analyze(self, landmarks_mash,landmark_1000):

        bottom_head_y = (landmarks_mash[285][1] + landmarks_mash[295][1])/2
        bottom_head_x = landmarks_mash[285][0]

        bottom_mid_y = landmarks_mash[282][1]
        bottom_mid_x = landmarks_mash[282][0]

        bottom_tail_y = landmarks_mash[300][1]
        bottom_tail_x = landmarks_mash[300][0]

        if bottom_head_y >= bottom_tail_y : 
            if bottom_tail_y / bottom_head_y >= 99:
                return True
            else:
                return False
        else:
            return False

        