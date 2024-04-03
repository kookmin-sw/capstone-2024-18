from flask import Flask, request, send_file
import json
import sys
import os
sys.path.append('./face_maker/DualStyleGAN')
from PIL import Image
import base64
from face_maker.DualStyleGAN.style_transfer import *
import io

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello World"


@app.route('/generate_image', methods = ['POST']) #flask는 단일스레드+동기처리를 수행하기 때문에 face_maker는 항상 하나의 요청에서만 접근된다.
def generate_image():

    print(type(request.files['image']))
    print(request.values.keys())
    file_path = request.values['user_id']+'.jpg'
    request.files['image'].save(file_path)
    virtual_face = face_maker.generate(file_path,int(request.values['style_id']))

    pil_virutal_face = Image.fromarray(virtual_face.astype('uint8'))
    file_object = io.BytesIO()

    # write JPEG in file-object
    pil_virutal_face.save(file_object, 'JPEG')
    
    # move to beginning of file so `send_file()` it will read from start
    file_object.seek(0)

    #remove temp jpg file
    os.remove(file_path)
    
    return send_file(file_object, mimetype='image/jpeg')

if __name__ == '__main__':
    face_maker = StyleTransfer()
    app.run(host='0.0.0.0', debug=True, use_reloader=False)