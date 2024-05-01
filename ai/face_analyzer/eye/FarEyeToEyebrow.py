import sys
import os
# importing
from PartType import PartType

class FarEyeToEyebrow(PartType):
    def __init__(self):
        super().__init__()
        self.name="눈과 눈썹사이가 넓은 경우"
        self.description="눈과 눈썹사이가 넓은 경우 손윗사람이나 친구의 도움으로 인생을 개척할 수 있습니다. 또한 성격이 대범하고 인맥이 넓어 인기가 많습니다. 여성의 경우 색기가 있어 남자를 유혹하기 쉽습니다."
        self.tag=["인기쟁이", "사교적"]


    def analyze(self, landmarks_mash,landmark_1000):
        eye_to_eyebrow = landmarks_mash[386][1] - landmarks_mash[282][1]
        eye_to_chin = landmarks_mash[152][1] - landmarks_mash[285][1]

        user_rate = eye_to_eyebrow/eye_to_chin
        standard_rate = 0.114



        eye_to_eyebrow_sigma = 0.02
        return (user_rate - standard_rate) / eye_to_eyebrow_sigma #눈꼬리가 올라간 눈이면 음수가 반환