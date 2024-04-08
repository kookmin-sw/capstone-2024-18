import sys
import torch
from landmark_model.face_detector import *
from landmark_model.face_landmark import *
import cv2
import mediapipe as mp
from IPython.display import Image, display
from landmark_model.land_idx import *
import numpy as np
import io
import os

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')



def image_run(image_path):
    #이미지 불러오기
    image = cv2.imread(image_path) # 이미지 읽어오기
    image = cv2.resize(image, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)  # 이미지를 2배로 확대
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # face_landmark_model_1000
    face_detector_handle = FaceDetector()
    face_landmark_handle = FaceLandmark()
    detections, _ = face_detector_handle.run(image)

    # face_detector_handle.show_result(image, detections)

    if len(detections) == 0:
        return

    for detection in detections:

        model_1000_landmarks, states = face_landmark_handle.run(image, detection)
        # face_landmark_handle.show_result(image_path,image, landmarks)

    # Mediapipe
    # MediaPipe FaceMesh 초기화
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh()

    results = face_mesh.process(image_rgb)
    mediapipe_landmarks = []
    
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            for idx, landmark in enumerate(face_landmarks.landmark):
                mediapipe_landmarks.append([landmark.x * image.shape[1],landmark.y * image.shape[0]])
                if idx not in LandmarkIdx.all_idx:continue
                x = int(landmark.x * image.shape[1]) 
                y = int(landmark.y * image.shape[0])

                cv2.circle(image, (x, y), 2, (0, 255, 0), -1)  # 랜드마크를 초록색 점으로 표시
                cv2.putText(image, str(idx), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1)  # 랜드마크 번호 표시

    # 이미지 저장
    # output_image_path = 'result_'+ image_path
    # cv2.imwrite(output_image_path, image)


    # # 이미지 출력
    # display(Image(filename=output_image_path))

    return model_1000_landmarks,mediapipe_landmarks
