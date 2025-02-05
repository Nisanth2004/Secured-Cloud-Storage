import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/api";
import axios from 'axios';

const FileUploadDownload = () => {
  const { currentUser } = useMyContext();
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !password) {
      toast.error("File and password are required!");
      return;
    }

    const formData = new FormData();
    formData.append("username", currentUser.username);
    formData.append("file", file);
    formData.append("password", password);

    setLoading(true);
    try {
      // Upload file
      await axios.post("http://192.168.118.254:5006/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully!");

      // Save password in the database
      await api.post("/auth/public/passwords/save", {
        userId: currentUser.id,
        password,
      });
      toast.success("Password saved successfully!");
    } catch (error) {
      toast.error("Error uploading file or saving password");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadFileName) {
      toast.error("Filename is required!");
      return;
    }

    try {
      const response = await axios.get(`http://192.168.118.254:5006/download/${currentUser.username}/${downloadFileName}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("File downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading file");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">File Upload & Download</h2>

        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Choose File</label>
            <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded-lg" />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-blue-600 text-black py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-gray-800 text-center mb-4">Download File</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Filename</label>
            <input
              type="text"
              placeholder="Enter filename to download"
              value={downloadFileName}
              onChange={(e) => setDownloadFileName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={handleDownload}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Download File
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadDownload;
