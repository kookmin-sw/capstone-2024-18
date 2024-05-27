import sys
import os
# importing
from PartType import PartType

class CloseEyeToEye(PartType):
    def __init__(self):
        super().__init__()
        self.name="눈과 눈 사이가 가까울 경우"
        self.description="눈과 눈 사이가 가까울 경우 직감적이고 선견지명이 있어 유행이나 시대를 잘 읽습니다. 또한 상황판단이 빠르며 처세에 능해 달변가와 합리주의자가 많습니다."
        self.tag=["합리주의자","달변가","선견지명"]


    def analyze(self, landmarks_mash,landmark_1000):
        inner_eye_to_eye = landmarks_mash[362][0] - landmarks_mash[133][0]
        outer_eye_to_eye = landmarks_mash[356][0] - landmarks_mash[127][0]

        user_rate = inner_eye_to_eye/outer_eye_to_eye
        standard_rate = 0.245
        
        face_radius = 0.015
        return (standard_rate - user_rate)/face_radius