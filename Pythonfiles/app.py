import os
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import serial  # For UART communication with ESP8266
# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "secure_key"
# ESP8266 UART Configuration
esp8266 = serial.Serial('/dev/serial0', baudrate=115200, timeout=1)

  # Adjust the port based on your system
# Folder for storing uploaded files
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handles file upload and saves files in user-specific folders."""
    if 'username' not in request.form or 'password' not in request.form:
        return jsonify({'error': 'Username and password are required'}), 400

    username = request.form['username']
    password = request.form['password']

    if not username:
        return jsonify({"error": "Username is required"}), 400

    if not password:
        password = "default_password"
        print("\n⚠ *No password received. Using default password.*")

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    user_data = f"{username}:{password}\n"

    # Send user data over UART to ESP8266
    print(f"📡 Attempting to send: {user_data}")
    if( esp8266.write((user_data + "\n").encode("utf-8"))):
        esp8266.flush()
        print(f"\n📡 Sent to ESP8266 via UART: {user_data}")
    else:
        print("⚠ Failed to write data")
    # Save the file in the user's specific folder
    user_folder = os.path.join(app.config['UPLOAD_FOLDER'], username)
    os.makedirs(user_folder, exist_ok=True)

    file_path = os.path.join(user_folder, file.filename)
    file.save(file_path)

    print(f"\n✅ *File '{file.filename}' uploaded successfully for user: {username}*")
    return jsonify({"message": f"File '{file.filename}' uploaded successfully!"})
# Route to list all files in a user's folder
@app.route('/list-files/<username>', methods=['GET'])
def list_files(username):
    user_folder = os.path.join(app.config['UPLOAD_FOLDER'], username)

    if not os.path.exists(user_folder):
        return jsonify({"error": "User folder not found"}),404

    files = os.listdir(user_folder)
    return jsonify({"files":files})

# ✅ **Your Download Route**
@app.route("/download/<username>/<filename>", methods=["GET"])
def download_file(username, filename):
    """Allows users to download their own files"""
    user_folder = os.path.join(app.config["UPLOAD_FOLDER"], username)
    file_path = os.path.join(user_folder, filename)

    if os.path.exists(file_path):
        print(f"\n📥 **User '{username}' is downloading file: {filename}**")
        return send_from_directory(user_folder, filename, as_attachment=True)

    return "File not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5006,threaded=True)