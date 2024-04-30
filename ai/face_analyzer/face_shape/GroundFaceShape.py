import sys
import os
sys.path.append('../')
# importing
from PartType import PartType

class GroundFaceShape(PartType):
    def __init__(self):
        super().__init__()
        self.name="마름모형(토)"
        self.description="마름모형의 얼굴형을 가진 사람은 강한 의지력을 가지고 있습니다. 일을 할 때에도 스스로의 경험을 통해 분석하여 본인의 스타일을 찾아 합리적으로 처리하는 경향이 있습니다."
        self.tag=["끈기","의지력","인내력","합리적임"]
        
    #수정 필요
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
        forehead_error = 0.851 - forehead_ratio
        #턱 비율 오차
        chin_error = 0.832 - chin_ratio
        #얼굴세로 오차
        face_height_error = 1.369 - face_height_ratio


        total_error = forehead_error + chin_error + face_height_error

        return total_error