class LandmarkIdx:
  # 얼굴 가로 점 127 - 356
  # 얼굴 세로 점 152 - 
  # 눈 가로 점 33-133
  # 코 가로 점 64-294
  # 입 가로 점 61-291

  #얼굴 테두리
  silhouette= [ 
    127, 356, 10,  338, 297, 332, 284, 251, 389, 454, 323, 361, 288,
    397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
    172, 58,  132, 93,  234, 162, 21,  54,  103, 67,  109
  ]
  #윗입술
  lipsUpperOuter= [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291]
  #아랫입술
  lipsLowerOuter= [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]

  #왼쪽 눈 위,아래
  leftEyeUpper= [246, 161, 160, 159, 158, 157, 173]
  leftEyeLower= [33, 7, 163, 144, 145, 153, 154,155, 133]
  #오른쪽 눈 위,아래
  rightEyeUpper= [466, 388, 387, 386, 385, 384, 398]
  rightEyeLower= [263, 249, 390, 373, 374, 380, 381, 382, 362]
  #왼쪽 눈썹 위,아래
  leftEyebrowUpper= [70, 63, 105, 66, 107, 55]
  leftEyebrowLower= [53, 52, 65]
  #오른쪽 눈썹 위,아래
  rightEyebrowUpper= [ 300, 293, 334, 296, 336, 285]
  rightEyebrowLower= [283, 282, 295]

  nose_tip = [64, 294, 168, 122, 174, 198, 209, 49, 48, 98, 97, 2, 326, 327, 278, 279, 420, 429, 399, 351]

  
  all_idx = silhouette+lipsUpperOuter+lipsLowerOuter+rightEyeUpper+rightEyeLower+leftEyeUpper+leftEyeLower+rightEyebrowUpper+rightEyebrowLower+leftEyebrowUpper+leftEyebrowLower+nose_tip
