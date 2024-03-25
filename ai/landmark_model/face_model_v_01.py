import sys
import torch
from face_detector import *
from face_landmark import *
import cv2
import mediapipe as mp
from IPython.display import Image, display
from land_idx import *
import numpy as np


def image_run():
    #이미지 불러오기
    image_path = 'test3.jpg'  # 얼굴 이미지 파일 경로 설정
    image = cv2.imread(image_path) # 이미지 읽어오기
    image = cv2.resize(image, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)  # 이미지를 2배로 확대
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # face_landmark_model_1000
    face_detector_handle = FaceDetector()
    face_landmark_handle = FaceLandmark()
    detections, _ = face_detector_handle.run(image)

    face_detector_handle.show_result(image, detections)

    if len(detections) == 0:
        return

    for detection in detections:
        landmarks, states = face_landmark_handle.run(image, detection)
        face_landmark_handle.show_result(image_path,image, landmarks)

    # Mediapipe
    # MediaPipe FaceMesh 초기화
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh()

    results = face_mesh.process(image_rgb)
    
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            min_y = sys.maxsize
            max_y = 0
            for idx, landmark in enumerate(face_landmarks.landmark):
                if idx not in LandmarkIdx.all_idx:continue
                x = int(landmark.x * image.shape[1]) 
                y = int(landmark.y * image.shape[0])

                if y>max_y :  # 얼굴 최하단 좌표 
                    max_x = x
                    max_y = y
                if y<min_y :  # 얼굴 최상단 좌표
                    min_y = y
                    min_x = x

                cv2.circle(image, (x, y), 2, (0, 255, 0), -1)  # 랜드마크를 초록색 점으로 표시
                cv2.putText(image, str(idx), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1)  # 랜드마크 번호 표시
            
            cv2.putText(image, str((min_x,min_y)), (min_x, min_y), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1)
            cv2.putText(image, str((max_x,max_y)), (max_x,max_y), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1)


    # 이미지 저장
    output_image_path = 'result_'+ image_path
    cv2.imwrite(output_image_path, image)

    # 이미지 출력
    display(Image(filename=output_image_path))


image_run()