import sys
import os
# importing
from PartType import PartType

class SmallEye(PartType):
    def __init__(self):
        self.name="작은 눈"
        self.description="작은 눈은 ~~"


    def analyze(self, landmarks_mash,landmark_1000):
        eye_height = landmarks_mash[374][1] - landmarks_mash[386][1]
        eye_to_chin = landmarks_mash[152][1] - landmarks_mash[362][1]

        user_rate = eye_height/eye_to_chin
        standard_rate = 1.02 / 12.1

        eye_height_sigma = 0.0125
        print(user_rate)
        return (standard_rate - user_rate) / eye_height_sigma #큰 눈이면 음수가 반환, z-score 반환