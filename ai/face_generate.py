from flask import Flask, request, jsonify
import json
import sys
import os
sys.path.append('./face_maker/DualStyleGAN')
from PIL import Image
import base64
from face_maker.DualStyleGAN.style_transfer import *
import io, glob

app = Flask(__name__)
face_maker = StyleTransfer()

@app.route('/')
def home():
    return "Hello World"


@app.route('/generate_image', methods = ['POST']) #flask는 단일스레드+동기처리를 수행하기 때문에 face_maker는 항상 하나의 요청에서만 접근된다.
def generate_image():

    print('----------------------------------------\n')
    print(type(request.files['image']))
    print(request.values.keys())
    print('----------------------------------------\n')

    # 파일 저장 위치 만들기
    file_path = request.values['user_id'] + '.jpeg'

    # 파일 저장
    request.files['image'].save(file_path)
        
    # 관상 이미지 생성
    virtual_face = face_maker.generate(file_path, int(request.values['style_id']),weight=[1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    
    # Image 인스턴스로 변환
    pil_virutal_face = Image.fromarray(virtual_face.astype('uint8'))
    file_object = io.BytesIO()

    # 이미지를 바이너리로 저장
    pil_virutal_face.save(file_object, format='JPEG')
    image_binary = file_object.getvalue()

    response_data = {'image_binary':base64.b64encode(image_binary).decode('utf-8')}

        # 기존 사진 삭제
    if os.path.exists(file_path):
        os.remove(file_path)
    else:
        pass
    
    return jsonify(response_data)
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, use_reloader=False)