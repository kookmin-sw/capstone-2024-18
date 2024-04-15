import face_shape.FireFaceShape
import face_shape.GoldFaceShape
import face_shape.GroundFaceShape
import face_shape.TreeFaceShape
import face_shape.WaterFaceShape

def FaceShapePolicy(result):
    type_name = max(result)
    return type_name
