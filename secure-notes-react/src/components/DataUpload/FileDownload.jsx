import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import axios from 'axios';

const FileDownload = () => {
  const { currentUser } = useMyContext();
  const [downloadFileName, setDownloadFileName] = useState("");

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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Download File</h2>

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
  );
};

export default FileDownload;
