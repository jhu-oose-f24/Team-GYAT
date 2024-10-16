import base64
import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename

def save_image_from_base64(image_base64):
    image_data = base64.b64decode(image_base64)
    filename = secure_filename(f"image_{uuid.uuid4().hex}.jpg")
    images_dir = os.path.join(current_app.root_path, 'static', 'images')
    if not os.path.exists(images_dir):
        os.makedirs(images_dir)
    image_path = os.path.join(images_dir, filename)
    with open(image_path, 'wb') as f:
        f.write(image_data)
    return f'images/{filename}'
