import sys
import os
# importing
from PartType import PartType

class CloseEyeToEye(PartType):
    def __init__(self):
        self.name="눈과 눈 사이가 가까울 경우"
        self.description="눈과 눈 사이가 가까울 경우는 ~~"


    def analyze(self, landmarks_mash,landmark_1000):
        inner_eye_to_eye = landmarks_mash[362][0] - landmarks_mash[133][0]
        outer_eye_to_eye = landmarks_mash[356][0] - landmarks_mash[127][0]

        user_rate = inner_eye_to_eye/outer_eye_to_eye
        standard_rate = 0.245
        
        print('far eye', user_rate)
        face_radius = 0.015
        return (standard_rate - user_rate)/face_radius