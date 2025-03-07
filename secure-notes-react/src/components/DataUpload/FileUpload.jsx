import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { nanoid } from "nanoid";
import { useMyContext } from "../../store/ContextApi";
import { FiUploadCloud } from "react-icons/fi";

const FileUpload = () => {
  const { currentUser } = useMyContext();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0); // State for progress bar
  const SERVER_IP = "http://192.168.149.254:5006";
  useEffect(() => {
    setPassword(nanoid(4));
  }, []);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !password) {
      toast.error("File and password are required!");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("file", file);

    setLoading(true);

    // Toast notification for uploading
    const toastId = toast.loading("Uploading...");

    try {
      await axios.post(`${SERVER_IP}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent); // Update progress
          }
        },
      });

      // On success, update toast
      toast.success("File uploaded successfully!", { id: toastId });
    } catch (error) {
      // On error, update toast
      toast.error("Error uploading file", { id: toastId });
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset progress after upload
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 transform transition duration-300 hover:scale-105 border border-gray-200">
        {/* Animated progress bar */}
        {loading && (
          <div className="w-full h-2 bg-gray-300 rounded-full mb-4">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="flex flex-col items-center">
          <FiUploadCloud className="text-blue-600 text-6xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {username ? `Hello, ${username}` : "Hello, Guest"}
          </h2>
        </div>

        {/* Drop zone for file selection */}
        <div className="mb-6">
          <label className="block text-lg text-gray-700 font-semibold mb-2">
            Choose File
          </label>
          <div
            className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <span className="text-gray-700">{file.name}</span>
            ) : (
              <span className="text-gray-400">Drag & drop or click to select a file</span>
            )}
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full py-3 rounded-xl shadow-md bg-green-600 text-white font-semibold tracking-wide active:scale-95 flex items-center justify-center"
        >
          {loading ? (
            <span className="animate-pulse">Uploading...</span>
          ) : (
            <>
              
                
              <span>Upload File</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
