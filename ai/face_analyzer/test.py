import math

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

# 테스트
point_a = (1, 0)  # 점 A의 좌표
point_b = (0, 0)  # 점 B의 좌표 (기준점)
angle_deg = -90   # 회전 각도 (시계 방향)

# 회전 후 점 A의 좌표 계산
new_point = rotate_point_clockwise(point_a, point_b, angle_deg)

print("회전 후 점 A의 좌표:", new_point)



def calculate_angle(x1, y1, x2, y2, x3, y3):
    # 끼인 각을 이루는 세 변의 길이를 계산
    a = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)  # x1과 x2 사이의 변
    b = math.sqrt((x3 - x1)**2 + (y3 - y1)**2)  # x1과 x3 사이의 변
    c = math.sqrt((x3 - x2)**2 + (y3 - y2)**2)  # x2와 x3 사이의 변
    
    # 끼인 각의 코사인 값을 계산
    cos_angle = (a**2 + c**2 - b**2) / (2 * a * c)
    
    # 코사인 값에서 각도를 계산하고 라디안에서 도로 변환
    angle_rad = math.acos(cos_angle)
    angle_deg = math.degrees(angle_rad)
    
    return angle_deg

# 세 점의 좌표
x1, y1 = -1,0
x2, y2 = 0,0
x3, y3 = 0,1

# 끼인 각을 계산
angle = calculate_angle(x1, y1, x2, y2, x3, y3)
print("끼인 각:", angle)





def calculate_angle(x1, y1, x2, y2, x3, y3):
    # 각 점을 벡터로 표현
    vec1 = [x1 - x2, y1 - y2]
    vec2 = [x3 - x2, y3 - y2]
    
    # 외적을 계산하여 z 성분으로부터 시계 방향 여부를 판단
    cross_product = vec1[0] * vec2[1] - vec1[1] * vec2[0]
    
    # 시계 방향이면 양수 각도, 반시계 방향이면 음수 각도를 반환
    if cross_product > 0:
        return -calculate_positive_angle(vec1, vec2)
    else:
        return calculate_positive_angle(vec1, vec2)

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

# 세 점의 좌표
x1, y1 = 0,1
x2, y2 = 0,0
x3, y3 = -1,0

# 끼인 각을 계산
angle = calculate_angle(x1, y1, x2, y2, x3, y3)
print("끼인 각:", angle)




def polygon_area(points):
    n = len(points)
    area = 0.0

    for i in range(n):
        j = (i + 1) % n
        area += points[i][0] * points[j][1]
        area -= points[j][0] * points[i][1]

    area = abs(area) / 2.0
    return area

rectangle_points = [(1, 1), (4, 1), (4, 4), (1, 4)]

print(polygon_area(rectangle_points))