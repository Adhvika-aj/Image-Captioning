from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import logging
import time
import random

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# List of captions in desired order
captions_list = [
    "A cat sitting on a couch.",
    "A happy dog running in the park.",
    "A sleepy cat lounging in the sun.",
    "A puppy playing with a ball.",
    "A dog waiting by the door."
]

def get_next_caption(current_index):
    # If we're at the end, go back to the first caption
    if current_index >= len(captions_list) - 1:
        return captions_list[0], 0
    next_index = current_index + 1
    return captions_list[next_index], next_index

@app.route('/generate_caption', methods=['POST'])
def generate_caption():
    logger.debug("Received request to generate caption")
    
    if 'image' not in request.files:
        logger.error("No image part in request")
        return jsonify({'error': 'No image part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        logger.error("No selected file")
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    logger.debug(f"Saved file: {filename}")

    # Get the image count from the request
    data = request.form
    image_count = int(data.get('currentIndex', 0))
    logger.debug(f"Image count from request: {image_count}")
    
    # Simulate model processing time (random delay between 5-10 seconds)
    processing_time = random.uniform(5, 10)
    logger.debug(f"Simulating model processing time: {processing_time:.2f} seconds")
    time.sleep(processing_time)
    
    # Use the image count to select the caption
    # If we've gone through all captions, start over
    caption_index = image_count % len(captions_list)
    caption = captions_list[caption_index]
    
    logger.debug(f"Returning caption: {caption} (index: {caption_index})")
    return jsonify({'caption': caption, 'index': caption_index}), 200

@app.route('/next_caption', methods=['POST'])
def next_caption():
    data = request.get_json()
    current_index = data.get('currentIndex', -1)
    caption, index = get_next_caption(current_index)
    logger.debug(f"Returning next caption: {caption} (index: {index})")
    return jsonify({'caption': caption, 'index': index}), 200

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(port=5000, debug=True)
