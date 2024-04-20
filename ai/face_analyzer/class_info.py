from eye import BigEye, SmallEye, CloseEyeToEye, CloseEyeToEyebrow, FarEyeToEye, FarEyeToEyebrow, HightailEye, LowtailEye, EyePolicy
from face_shape import FireFaceShape,GroundFaceShape,WaterFaceShape,GoldFaceShape,TreeFaceShape,FaceShapePolicy
from lips import BigLips, LipsPolicy,BigUpperLips, SmallLips, SmallUpperLips
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
            BigEye.BigEye,
            SmallEye.SmallEye,
            CloseEyeToEye.CloseEyeToEye,
            CloseEyeToEyebrow.CloseEyeToEyebrow,
            FarEyeToEye.FarEyeToEye,
            FarEyeToEyebrow.FarEyeToEyebrow,
            HightailEye.HightailEye,
            LowtailEye.LowtailEye,
        ],
        "policy":EyePolicy.EyePolicy
    },
    "lips":{
        "types":[
            BigLips.BigLips,
            SmallLips.SmallLips,
            BigUpperLips.BigUpperLips,
            SmallUpperLips.SmallUpperLips
        ],
        "policy":LipsPolicy.LipsPolicy
    }
}
