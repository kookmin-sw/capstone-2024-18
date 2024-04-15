import sys
import os
sys.path.append('../')
from PartType import PartType

class TreeFaceShape(PartType):
    def __init__(self):
        self.name="역삼각형"
        self.description="목"


    def analyze(self, landmarks_mash,landmark_1000):
        
        face_mide_x = landmarks_mash[152][0]

        
        chin_list = [379,365,397,288,361,323]
        mouth_and_chin_diff = sys.maxsize
        for i in chin_list:
            
            tmp = abs(landmarks_mash[291][1] - landmarks_mash[i][1])
            if mouth_and_chin_diff > tmp :
                mouth_and_chin_diff = tmp
                chin_idx = i
        
        #광대 가로폭(비율 1)
        face_width = landmarks_mash[356][0] - face_mide_x
        #이마 가로폭
        forehead_width = landmark_1000[40][0] - face_mide_x
        #턱 가로폭
        chin_width = landmarks_mash[chin_idx][0] - face_mide_x
        #chin_width = landmarks_mash[365][0] - face_mide_x
        
        #광대,이마 비율
        forehead_ratio = forehead_width / face_width
        #광대,턱 비율
        chin_ratio = chin_width / face_width
        
        #이마 비율 오차
        forehead_error = forehead_ratio -0.851
        #턱 비율 오차
        chin_error = 0.832 - chin_ratio

        
        total_error = forehead_error + chin_error
        
        return total_error
