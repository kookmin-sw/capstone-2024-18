import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class GoldFaceShape(PartType):
    def __init__(self):
        self.name="직사각형"
        self.description="금"


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
        #얼굴 세로 폭
        face_height = landmarks_mash[152][1] - landmark_1000[71][1]
        #이마 가로폭
        forehead_width = landmark_1000[40][0] - face_mide_x
        #턱 가로폭
        chin_width = landmarks_mash[chin_idx][0] - face_mide_x

        #광대,얼굴세로 비율
        face_height_ratio = face_height / face_width / 2
        #광대,이마 비율
        forehead_ratio = forehead_width / face_width
        #광대,턱 비율
        chin_ratio = chin_width / face_width

        #이마 비율 오차
        forehead_error = forehead_ratio - 0.851
        #턱 비율 오차
        chin_error = chin_ratio - 0.832
        #얼굴세로 오차
        face_height_error = face_height_ratio - 1.369


        # 이마와 턱 비율은 직사각형에서는 오차가 작을수록 좋은건데 다른 오차는 클수록 좋은 걸로 되서 빼는게 맞는것같은데 잘 모르곘다.
        total_error = face_height_error + forehead_error + chin_error

        return total_error