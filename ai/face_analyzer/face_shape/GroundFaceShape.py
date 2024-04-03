import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class GroundFaceShape(PartType):
    def __init__(self):
        self.name="원형"
        self.description="독수리 눈은 ~~"


    def analyze(self, landmarks_mash,landmark_1000):
        #비율 계산? 어떤 방식으로든 하나의 숫자로 리턴 해야함
        return 3