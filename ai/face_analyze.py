from flask import Flask, request, send_file
import json
import sys
import os
sys.path.append('./face_analyzer')
from PIL import Image
import io

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello World"


@app.route('/analyze_image', methods = ['POST']) #flask는 단일스레드+동기처리를 수행하기 때문에 face_maker는 항상 하나의 요청에서만 접근된다.
def generate_image():

    print(type(request.files['image']))
    print(request.values.keys())
    
    result = {'face':"화", "eye":'독수리'}
    
    return json.dumps(result, ensure_ascii=False)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, use_reloader=False)