import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import axios from "axios";

const FileUpload = () => {
  const { currentUser } = useMyContext();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !username) {
      toast.error("File  is required!");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("file", file);

    setLoading(true);
    try {
      await axios.post("http://192.168.118.254:5006/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 transform transition-all duration-300 ease-in-out hover:scale-105">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {username ? `Hello, ${username}` : "Hello, Guest"}
        </h2>

        <div className="mb-6">
          <label className="block text-lg text-gray-700 font-semibold mb-2">
            Choose File
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:shadow-lg"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          {loading ? (
            <span className="animate-pulse">Uploading...</span>
          ) : (
            "Upload File"
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
