import sys
import os
sys.path.append('../')
from PartType import PartType

class FireFaceShape(PartType):
    def __init__(self):
        self.name="역삼각형"
        self.description=""


    def analyze(self, landmarks_mash, landmark_1000):
        #비율 계산? 어떤 방식으로든 하나의 숫자로 리턴 해야함
        return 1