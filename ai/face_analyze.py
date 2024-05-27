from flask import Flask, request, jsonify
import json
import sys
import os
sys.path.append('./face_analyzer')
sys.path.append('./landmark_model')

from PIL import Image
import io
from face_analyzer.analyze import getType
import os
import onnxruntime as ort
ort.set_default_logger_severity(3)

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello World"


@app.route('/analyze_face', methods = ['POST']) #flask는 단일스레드+동기처리를 수행하기 때문에 face_maker는 항상 하나의 요청에서만 접근된다.
def generate_image():

    file_path = request.values['user_id'] + '.jpeg'
    
    # # 파일 저장
    request.files['image'].save(file_path)
    
    result = getType(file_path)
    
    # 기존 사진 삭제
    if os.path.exists(file_path):
        os.remove(file_path)
    else:
        pass

    return json.dumps(result, ensure_ascii=False)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, use_reloader=False)