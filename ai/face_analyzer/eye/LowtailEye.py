import sys
import os
# importing
from PartType import PartType

class LowtailEye(PartType):
    def __init__(self):
        self.name="눈꼬리가 내려간 눈"
        self.description="눈꼬리가 내려간 눈은~~~"


    def analyze(self, landmarks_mash,landmark_1000):
        tail_height = landmarks_mash[362][1] - landmarks_mash[263][1]
        eye_to_chin = landmarks_mash[152][1] - landmarks_mash[362][1]

        user_rate = tail_height/eye_to_chin
        standard_rate = 0.0220703599865619565

        tail_height_sigma = 0.01
        print(user_rate)
        return (standard_rate - user_rate) / tail_height_sigma #눈꼬리가 올라간 눈이면 음수가 반환