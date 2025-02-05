import os
from flask import Flask, request, session, jsonify, send_from_directory, redirect, url_for
from flask_cors import CORS

# Initialize Flask app and database
app = Flask(_name_)
CORS(app, supports_credentials=True)  # Allow cross-origin with credentials
app.secret_key = "secure_key"

# The folder to save uploaded files
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Home page with login, register, upload, and download options
@app.route('/')
def index():
    if 'username' in session:
        return '''
        <h1>Welcome, {}</h1>
        <form method="POST" enctype="multipart/form-data" action="/upload">
            <input type="file" name="file">
            <input type="submit" value="Upload File">
        </form>
        <form method="GET" action="/download">
            <input type="text" name="filename" placeholder="Enter filename to download">
            <input type="submit" value="Download File">
        </form>
        <br><a href="/logout">Logout</a>
        '''.format(session["username"])

    return '''
    <h1>Pi File Manager</h1>
    <form method="POST" action="/login">
        <input type="text" name="username" placeholder="Enter Username" required><br>
        <input type="password" name="password" placeholder="Enter Password" required><br>
        <input type="submit" value="Login">
    </form>
    <h2>New User? Create an account:</h2>
    <form method="POST" action="/register">
        <input type="text" name="new_username" placeholder="Enter New Username" required><br>
        <input type="password" name="new_password" placeholder="Enter New Password" required><br>
        <input type="submit" value="Create Account">
    </form>
    '''
# Route to handle file upload
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'username' not in request.form:
        return 'Username is required', 400

    username = request.form['username']

    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    # Save the file in the user's specific folder
    user_folder = os.path.join(app.config['UPLOAD_FOLDER'], username)
    os.makedirs(user_folder, exist_ok=True)

    file_path = os.path.join(user_folder, file.filename)
    file.save(file_path)

    return f'File "{file.filename}" uploaded successfully!'

# Route to handle file download
@app.route("/download/<username>/<filename>", methods=["GET"])
def download_file(username, filename):
    user_folder = os.path.join(app.config["UPLOAD_FOLDER"], username)
    file_path = os.path.join(user_folder, filename)

    if os.path.exists(file_path):
        return send_from_directory(user_folder, filename)

    return "File not found",404


if _name_ == '_main_':
    app.run(host='0.0.0.0', debug=True, port=5006)