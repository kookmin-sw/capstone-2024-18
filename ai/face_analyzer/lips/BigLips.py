import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class BigLips(PartType):
    def __init__(self):
        self.name="큰 입"
        self.description="큰 입은 ~~"


    def analyze(self, landmarks_mash,landmark_1000):
        lips_width = landmarks_mash[291][0] - landmarks_mash[61][0]
        eye_to_eye = landmarks_mash[362][0] - landmarks_mash[133][0]
        
        user_rate = lips_width/eye_to_eye
        standard_rate = 1.2
        
        lips_width_sigma = 0.1
        return (user_rate - standard_rate) / lips_width_sigma #큰 눈이면 음수가 반환, z-score 반환