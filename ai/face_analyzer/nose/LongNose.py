import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class LongNose(PartType):
    def __init__(self):
        self.name="긴코"
        self.description="긴코는~"


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
        nose_error = nose_ratio - 0.4579

        return nose_error