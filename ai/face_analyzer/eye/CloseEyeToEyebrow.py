import sys
import os
# importing
from PartType import PartType

class CloseEyeToEyebrow(PartType):
    def __init__(self):
        self.name="눈과 눈썹사이가 가까울 경우"
        self.description="눈과 눈썹사이가 가까울 경우는 ~~~"



    def analyze(self, landmarks_mash,landmark_1000):
        eye_to_eyebrow = landmarks_mash[386][1] - landmarks_mash[282][1]
        eye_to_chin = landmarks_mash[152][1] - landmarks_mash[285][1]

        user_rate = eye_to_eyebrow/eye_to_chin
        standard_rate = 0.114



        eye_to_eyebrow_sigma = 0.02
        return (standard_rate - user_rate) / eye_to_eyebrow_sigma #눈꼬리가 올라간 눈이면 음수가 반환