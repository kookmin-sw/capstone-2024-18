import json
from FaceComponent import FaceComponent
from FacePart import FacePart
from PartType import PartType
import class_info


face: FaceComponent = FacePart("전체얼굴", "root")

for part_name, types in class_info.face.items():
    #print(part_name, types)
    part: FaceComponent = FacePart(part_name, part_name)
    for typeclass in types:
        parttype: PartType = typeclass()
        part.add(parttype)
    face.add(part)

face._print()

print(face.faceComponents['eye'].analyze([1,2,3]))
print(face.analyze([1,2,3]))

