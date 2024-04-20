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

def rotate_point_clockwise(point_a, point_b, angle_deg):
    """
    점 A를 점 B를 기준으로 주어진 각도만큼 시계 방향으로 회전시킨 후의 좌표를 반환합니다.
    
    :param point_a: 회전할 점 A의 좌표 (x, y)
    :param point_b: 기준점 B의 좌표 (x, y)
    :param angle_deg: 회전 각도 (도) - 시계 방향이 양수이고, 반시계 방향이 음수입니다.
    :return: 회전 후 점 A의 좌표 (x', y')
    """
    # 각도를 라디안으로 변환
    angle_rad = math.radians(angle_deg)
    
    # 점 A의 좌표
    x_a, y_a = point_a
    
    # 기준점 B의 좌표
    x_b, y_b = point_b
    
    # 회전 변환 공식을 사용하여 새로운 좌표 계산
    x_rotated = (x_a - x_b) * math.cos(angle_rad) - (y_a - y_b) * math.sin(angle_rad)
    y_rotated = (x_a - x_b) * math.sin(angle_rad) + (y_a - y_b) * math.cos(angle_rad)
    
    # 회전 후 좌표
    x_new = x_rotated + x_b
    y_new = y_rotated + y_b
    
    return x_new, y_new

# def calculate_angle(x1, y1, x2, y2, x3, y3):
#     # 끼인 각을 이루는 세 변의 길이를 계산
#     a = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)  # x1과 x2 사이의 변
#     b = math.sqrt((x3 - x1)**2 + (y3 - y1)**2)  # x1과 x3 사이의 변
#     c = math.sqrt((x3 - x2)**2 + (y3 - y2)**2)  # x2와 x3 사이의 변
    
#     # 끼인 각의 코사인 값을 계산
#     cos_angle = (a**2 + c**2 - b**2) / (2 * a * c)
    
#     # 코사인 값에서 각도를 계산하고 라디안에서 도로 변환
#     angle_rad = math.acos(cos_angle)
#     angle_deg = math.degrees(angle_rad)
    
#     return angle_deg

def calculate_angle(x1, y1, x2, y2, x3, y3):
    # 각 점을 벡터로 표현
    vec1 = [x1 - x2, y1 - y2]
    vec2 = [x3 - x2, y3 - y2]
    
    # 외적을 계산하여 z 성분으로부터 시계 방향 여부를 판단
    cross_product = vec1[0] * vec2[1] - vec1[1] * vec2[0]
    
    # 시계 방향이면 양수 각도, 반시계 방향이면 음수 각도를 반환
    if cross_product > 0:
        return calculate_positive_angle(vec1, vec2)
    else:
        return -calculate_positive_angle(vec1, vec2)

def calculate_positive_angle(vec1, vec2):
    # 두 벡터의 내적을 계산
    dot_product = vec1[0] * vec2[0] + vec1[1] * vec2[1]
    
    # 각도를 계산
    angle_rad = math.acos(dot_product / (magnitude(vec1) * magnitude(vec2)))
    angle_deg = math.degrees(angle_rad)
    
    return angle_deg

def magnitude(vec):
    # 벡터의 크기를 계산

    return math.sqrt(vec[0] ** 2 + vec[1] ** 2)

def calibration(landmarks):
    min_y = landmarks[10]
    max_y = landmarks[152]

    middle = [(min_y[0]+max_y[0])/2, (min_y[1]+max_y[1])/2]
    #print(min_y, middle, max_y)
    angle = calculate_angle(min_y[0],min_y[1], middle[0],middle[1], middle[0], 0)
    if angle>0: angle = max(0, angle-2)
    elif angle<0: angle = min(0, angle)
    #print("angle", angle)
    for i in range(len(landmarks)):
        landmarks[i] = rotate_point_clockwise(landmarks[i], middle, angle)
    
    return landmarks


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

    mediapipe_landmarks = calibration(mediapipe_landmarks)
    #print(mediapipe_landmarks[10], mediapipe_landmarks[152])
    for idx, point in enumerate(mediapipe_landmarks):
        if idx not in LandmarkIdx.all_idx:continue
        x,y=point
        x = int(x)
        y = int(y)
        cv2.circle(image, (x, y), 2, (0, 255, 0), -1)  # 랜드마크를 초록색 점으로 표시
        cv2.putText(image, str(idx), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1)  # 랜드마크 번호 표시

    # 이미지 저장
    output_image_path = 'result_'+ image_path
    cv2.imwrite(output_image_path, image)


    # # 이미지 출력
    # display(Image(filename=output_image_gktpath))

    return model_1000_landmarks,mediapipe_landmarks
