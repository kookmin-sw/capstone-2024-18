import sys
import os
# importing
from PartType import PartType

class HightailEye(PartType):
    def __init__(self):
        super().__init__()
        self.name="눈꼬리가 올라간 눈"
        self.description="눈꼬리가 올라간 눈을 가진 사람은 기가 세단 말을 종종 들으며 용기와 결단력이 있고 의지가 강합니다. 또한 합리적이며 뛰어난 판단력을 가지고 있습니다."
        self.tag = ["합리적","강한 용기"]

    def analyze(self, landmarks_mash,landmark_1000):
        tail_height = landmarks_mash[362][1] - landmarks_mash[263][1]
        eye_to_chin = landmarks_mash[152][1] - landmarks_mash[362][1]

        user_rate = tail_height/eye_to_chin
        standard_rate = 0.0220703599865619565

        tail_height_sigma = 0.01
        return (user_rate - standard_rate) / tail_height_sigma