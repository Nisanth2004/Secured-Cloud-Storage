import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import axios from "axios";
import { FaDownload } from "react-icons/fa"; // Import React Icon

const FileDownload = () => {
  const { currentUser } = useMyContext();
  const [downloadFileName, setDownloadFileName] = useState("");
  const [fileList, setFileList] = useState([]);

  const SERVER_IP = "https://forge-okay-requiring-marriage.trycloudflare.com";

  useEffect(() => {
    if (currentUser) {
      fetchFileList();
    }
  }, [currentUser]);

  const fetchFileList = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}/list-files/${currentUser.username}`
      );
      setFileList(response.data.files);
    } catch (error) {
      toast.error("Error fetching file list");
    }
  };

  const handleDownload = async () => {
    if (!downloadFileName) {
      toast.error("Filename is required!");
      return;
    }

    try {
      const response = await axios.get(
        `${SERVER_IP}/download/${currentUser.username}/${downloadFileName}`,
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-indigo-200 to-pink-200">
      <div className="w-full max-w-md bg-gray-100 shadow-2xl rounded-3xl p-8 transform transition duration-300 hover:scale-105">
        <div className="text-center mb-6">
          <FaDownload className="text-4xl text-green-600 mb-3 animate__animated animate__fadeIn" />
          <h2 className="text-3xl font-semibold text-gray-800">Download Your Files </h2>
        </div>

        <div className="mb-6">
          <label className="block text-lg text-gray-700 font-semibold mb-2">Select File</label>
          <select
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 hover:shadow-xl transition duration-300"
            onChange={(e) => setDownloadFileName(e.target.value)}
            value={downloadFileName}
          >
            <option value="">-- Select a file --</option>
            {fileList.map((file, index) => (
              <option
                key={index}
                value={file}
                className="p-2 hover:bg-indigo-200 transition duration-200"
              >
                {file}
              </option>
            ))}
          </select>
        </div>

        <button
  onClick={handleDownload}
  className= "bg-green-600 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center"
><svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
  <span>Download</span>
</button>


      </div>
    </div>
  );
};

export default FileDownload;
