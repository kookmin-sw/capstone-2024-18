import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class ShortNose(PartType):
    def __init__(self):
        super().__init__()
        self.name="짧은 코"
        self.description="짧은 코를 가진 사람은 성격이 싹싹하고 인정이 많습니다. 또한 융통성이 있어 결단이 빠르고 높은 지위를 가질 가능성이 있습니다. "
        self.tag=["싹싹함","융통성"]


    def analyze(self, landmarks_mash,landmark_1000):
        
        face_mide_x = landmarks_mash[152][0]
        face_width = landmarks_mash[356][0] - face_mide_x
        face_width *= 2

        nose_top = landmarks_mash[8][1]
        nose_bottom = landmarks_mash[2][1]
        
        #코 길이
        nose_height = nose_bottom - nose_top

        #코 길이 비율
        nose_ratio = nose_height / face_width

        #코 길이 오차
        nose_error = 0.4579 - nose_ratio

        return nose_error