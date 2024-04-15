import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class BigEye(PartType):
    def __init__(self):
        self.name="큰 눈"
        self.description="큰 눈은 ~~"


    def analyze(self, landmarks_mash,landmark_1000):
        eye_height = landmarks_mash[374][1] - landmarks_mash[386][1]
        eye_to_chin = landmarks_mash[152][1] - landmarks_mash[362][1]

        user_rate = eye_height/eye_to_chin
        standard_rate = 1.02 / 12.1

        eye_height_sigma = 0.0125
        return (user_rate - standard_rate) / eye_height_sigma #큰 눈이면 음수가 반환, z-score 반환