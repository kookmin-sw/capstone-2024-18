import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class NarrowNose(PartType):
    def __init__(self):
        super().__init__()
        self.name="좁은 코"
        self.description="좁은 코를 가진 사람은 꼼꼼하고 계산이 철저해 안정적인 삶을 살 수 있습니다."
        self.tag=["꼼꼼함","안정된 삶"]


    def analyze(self, landmarks_mash,landmark_1000):

        face_mide_x = landmarks_mash[152][0]
        face_width = landmarks_mash[356][0] - face_mide_x
        face_width *= 2

        left_nose = landmarks_mash[64][0]
        right_nose = landmarks_mash[294][0]

        #콧볼 넓이
        nose_width = right_nose - left_nose

        #콧볼 비율
        nose_ratio = nose_width / face_width

        #콧볼 오차
        nose_error = 0.257 - nose_ratio

        return nose_error