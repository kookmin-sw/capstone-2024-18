import sys
import os
# importing
from PartType import PartType
from landmark_model.land_idx import LandmarkIdx
from math import atan2

def polygon_area(points):
    n = len(points)
    area = 0.0

    for i in range(n):
        j = (i + 1) % n
        area += points[i][0] * points[j][1]
        area -= points[j][0] * points[i][1]

    area = abs(area) / 2.0
    return area


class BigUpperLips(PartType):
    def __init__(self):
        super().__init__()
        self.name="윗입술이 두꺼운 경우"
        self.description="윗입술이 두꺼운 경우 적극적이며 정이 깊어 타인에게 헌신적이고 두꺼울수록 이 성향이 강합니다. 또한 식욕,성욕 등의 본능이 강하고 미각, 감성이 뛰어나 요리사와 트로트 가수 등이 많습니다."
        self.tag=["헌신적","정이 많음", "본능적"]


    def analyze(self, landmarks_mash,landmark_1000):        
        land_idx = LandmarkIdx()
        upper_idx = land_idx.lipsUpperOuter + land_idx.lipsMiddle[::-1]
        lower_idx = land_idx.lipsLowerOuter + land_idx.lipsMiddle[::-1]
        print(upper_idx)
        upper_point = []
        lower_point = []
        for idx in upper_idx:
            upper_point.append(landmarks_mash[idx])
        for idx in lower_idx:
            lower_point.append(landmarks_mash[idx])        
        # upper_point = sorted(upper_point, key=lambda point: atan2(point[1], point[0]))
        # lower_point = sorted(lower_point, key=lambda point: atan2(point[1], point[0]))

        upper_area = polygon_area(upper_point)
        lower_area = polygon_area(lower_point)

        user_rate = upper_area/lower_area
        standard_rate = 0.55
        print('upper lips:', upper_area, lower_area)
        print(user_rate)
        lips_width_sigma = 0.035
        return (user_rate - standard_rate) / lips_width_sigma #큰 눈이면 음수가 반환, z-score 반환
    

