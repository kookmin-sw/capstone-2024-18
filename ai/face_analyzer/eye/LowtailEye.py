import sys
import os
# importing
from PartType import PartType

class LowtailEye(PartType):
    def __init__(self):
        super().__init__()
        self.name="눈꼬리가 내려간 눈"
        self.description="눈꼬리가 내려간 눈을 가진 사람은 성격이 온후하고 사교성이 좋아 사랑받습니다. 또한 주변과의 협조를 잘하며 배려심이 있습니다."
        self.tag=["온화함","배려심"]

    def analyze(self, landmarks_mash,landmark_1000):
        tail_height = landmarks_mash[362][1] - landmarks_mash[263][1]
        eye_to_chin = landmarks_mash[152][1] - landmarks_mash[362][1]

        user_rate = tail_height/eye_to_chin
        standard_rate = 0.0220703599865619565

        tail_height_sigma = 0.01
        print(user_rate)
        return (standard_rate - user_rate) / tail_height_sigma #눈꼬리가 올라간 눈이면 음수가 반환