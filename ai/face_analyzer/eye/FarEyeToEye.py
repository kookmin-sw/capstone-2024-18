import sys
import os
# importing
from PartType import PartType

class FarEyeToEye(PartType):
    def __init__(self):
        self.name="눈과 눈 사이가 먼 경우"
        self.description="눈과 눈 사이가 먼 경우는 ~~"


    def analyze(self, landmarks_mash,landmark_1000):
        inner_eye_to_eye = landmarks_mash[362][0] - landmarks_mash[133][0]
        outer_eye_to_eye = landmarks_mash[356][0] - landmarks_mash[127][0]

        user_rate = inner_eye_to_eye/outer_eye_to_eye
        standard_rate = 0.245
        
        face_radius = 0.015
        return (user_rate - standard_rate)/face_radius #작은 눈이면 음수가 반환, z-score 반환