import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class FireFaceShape(PartType):
    def __init__(self):
        super().__init__()
        self.name="삼각형(화)"
        self.description="삼각형의 얼굴형을 가진 사람은 사교성이 뛰어나고 지도력과 포용력을 갖고 있습니다. 감정에 솔직하며 의리가 있고 성실합니다."
        self.tag=["사교성","리더쉽","성실함"]


    def analyze(self, landmarks_mash,landmark_1000):

        face_mide_x = landmarks_mash[152][0]

        chin_list = [379,365,397,288,361,323]
        mouth_and_chin_diff = sys.maxsize
        for i in chin_list:
            
            tmp = abs(landmarks_mash[291][1] - landmarks_mash[i][1])
            if mouth_and_chin_diff > tmp :
                mouth_and_chin_diff = tmp
                chin_idx = i
        
        print(chin_idx)

        #광대 가로폭(비율 1)
        face_width = landmarks_mash[356][0] - face_mide_x
        #이마 가로폭
        forehead_width = landmark_1000[40][0] - face_mide_x
        #턱 가로폭
        chin_width = landmarks_mash[chin_idx][0] - face_mide_x
        
        #광대,이마 비율
        forehead_ratio = forehead_width / face_width
        #광대,턱 비율
        chin_ratio = chin_width / face_width

        #이마 비율 오차
        forehead_error = 0.851 - forehead_ratio
        #턱 비율 오차
        chin_error = chin_ratio - 0.832
        
        
        total_error = forehead_error + chin_error 
        
        return total_error
        