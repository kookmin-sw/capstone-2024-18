from eye import EagleEye, BigEye, EyePolicy
from face_shape import FireFaceShape,GroundFaceShape,WaterFaceShape,GoldFaceShape,TreeFaceShape

face = {
    "face_shape":{
        "types":[
            FireFaceShape.FireFaceShape,
            WaterFaceShape.WaterFaceShape,
            GoldFaceShape.GoldFaceShape,
            GroundFaceShape.GroundFaceShape,
            TreeFaceShape.TreeFaceShape
        ],
        "policy":lambda x: "역삼각형"
    },
    "eye":{
        "types":[
            EagleEye.EagleEye,
            BigEye.BigEye
        ],
        "policy":EyePolicy.EyePolicy
    }
}