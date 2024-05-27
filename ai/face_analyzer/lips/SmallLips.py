import sys
import os
# importing
from PartType import PartType

class SmallLips(PartType):
    def __init__(self):
        super().__init__()
        self.name="작은 입"
        self.description="작은 입을 가진 사람은 머리가 좋아 지적욕구가 강하며 솔직하고 예의가 바릅니다. 또한 미적감각이 뛰어난 경우도 많습니다."
        self.tag=["똑똑함","예의바름"]

    def analyze(self, landmarks_mash,landmark_1000):
        lips_width = landmarks_mash[291][0] - landmarks_mash[61][0]
        eye_to_eye = landmarks_mash[362][0] - landmarks_mash[133][0]
        
        user_rate = lips_width/eye_to_eye
        standard_rate = 1.2
        
        lips_width_sigma = 0.1
        return (standard_rate - user_rate) / lips_width_sigma #큰 눈이면 음수가 반환, z-score 반환