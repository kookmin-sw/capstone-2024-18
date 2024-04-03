import json
from FaceComponent import FaceComponent
from FacePart import FacePart
from PartType import PartType
import class_info
import sys
import io

import os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from landmark_model.face_model_v_01 import all_landmark_1000,all_landmark_mediapipe

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')

face: FaceComponent = FacePart("전체얼굴", "root")

for part_name, types in class_info.face.items():
    #print(part_name, types)
    part: FaceComponent = FacePart(part_name, part_name)
    for typeclass in types:
        parttype: PartType = typeclass()
        part.add(parttype)
    face.add(part)

face._print()

#print(face.analyze(all_landmark_mediapipe,all_landmark_1000))

def result_type(face,landmarkmodel1,landmarkmodel2):
    result_every_type = {}
    for face_type in face.analyze(landmarkmodel1,landmarkmodel2):
        result_every_type[face_type] = (max(face.analyze(landmarkmodel1,landmarkmodel2)[face_type]))
        
    return result_every_type

result_type(face,all_landmark_mediapipe,all_landmark_1000)