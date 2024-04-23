import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class WideNose(PartType):
    def __init__(self):
        self.name="넓은 코"
        self.description="넓은 코는~~"


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
        nose_error = nose_ratio - 0.257

        return nose_error