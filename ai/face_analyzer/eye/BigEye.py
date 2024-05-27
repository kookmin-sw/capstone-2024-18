import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class BigEye(PartType):
    def __init__(self):
        super().__init__()
        self.name="큰 눈"
        self.description="큰 눈을 가진 사람은 감수성이 풍부하고 낙천적인 성격을 가졌으며 이상주의자에 가깝습니다."
        self.tag = ["이상주의자", "감수성"]

    def analyze(self, landmarks_mash,landmark_1000):
        eye_height = landmarks_mash[374][1] - landmarks_mash[386][1]
        eye_to_chin = landmarks_mash[152][1] - landmarks_mash[362][1]

        user_rate = eye_height/eye_to_chin
        standard_rate = 1.02 / 12.1

        eye_height_sigma = 0.0125
        return (user_rate - standard_rate) / eye_height_sigma #큰 눈이면 음수가 반환, z-score 반환