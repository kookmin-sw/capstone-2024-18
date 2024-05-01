import sys
import os
# importing
from PartType import PartType

class SmallEye(PartType):
    def __init__(self):
        super().__init__()
        self.name="작은 눈"
        self.description="작은 눈을 가진 사람은 신중하고 관찰력이 뛰어나며 현실주의자에 가깝습니다."
        self.tag = "현실주의자"

    def analyze(self, landmarks_mash,landmark_1000):
        eye_height = landmarks_mash[374][1] - landmarks_mash[386][1]
        eye_to_chin = landmarks_mash[152][1] - landmarks_mash[362][1]

        user_rate = eye_height/eye_to_chin
        standard_rate = 1.02 / 12.1

        eye_height_sigma = 0.0125
        return (standard_rate - user_rate) / eye_height_sigma #큰 눈이면 음수가 반환, z-score 반환