import sys
import io
import os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
print(sys.path)
import json
from FaceComponent import FaceComponent
from FacePart import FacePart
from PartType import PartType
import class_info
from landmark_model.face_model_v_01 import image_run
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')

face: FaceComponent = FacePart("전체얼굴", "root")

for part_name, values in class_info.face.items():
    #print(part_name, types)
    types = values['types']
    policy = values['policy']
    part: FaceComponent = FacePart(part_name, part_name, policy)
    
    for typeclass in types:
        parttype: PartType = typeclass()
        part.add(parttype)
    face.add(part)

face._print()

part_names = class_info.face.keys()


#print(face.analyze(all_landmark_mediapipe,all_landmark_1000))

def getType(image_path):
    model_1000_landmarks,mediapipe_landmarks = image_run(image_path)

    face.analyze(mediapipe_landmarks, model_1000_landmarks)
    
    result_objects = {}
    for part_name in part_names:
        face_part = face.getChild(part_name)
        child = face_part.chooseChildByPolicy()
        result_objects[part_name] = {
            'name':child.name,
            'description':child.description,
            'tag':child.tag
        }

    return result_objects



if __name__ == "__main__":
    result = getType("small_upper_lips2.jpg")
    print(result)