from eye import EagleEye, BigEye, EyePolicy
from face_shape import FireFaceShape,GroundFaceShape,WaterFaceShape,GoldFaceShape,TreeFaceShape,FaceShapePolicy

face = {
    "face_shape":{
        "types":[
            FireFaceShape.FireFaceShape,
            WaterFaceShape.WaterFaceShape,
            GoldFaceShape.GoldFaceShape,
            GroundFaceShape.GroundFaceShape,
            TreeFaceShape.TreeFaceShape
        ],
        "policy":FaceShapePolicy.FaceShapePolicy
    },
    "eye":{
        "types":[
            EagleEye.EagleEye,
            BigEye.BigEye
        ],
        "policy":EyePolicy.EyePolicy
    }
}
