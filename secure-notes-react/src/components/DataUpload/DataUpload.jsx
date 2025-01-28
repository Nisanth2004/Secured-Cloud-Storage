import React, { useState } from 'react';
import axios from 'axios';

const DataUpload = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFilenameChange = (e) => {
    setFilename(e.target.value);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://192.168.46.254:5006/upload', formData);
      setMessage(response.data); // Backend success message
    } catch (error) {
      setMessage('Error uploading file: ' + (error.response?.data || error.message));
    }
  };

  const downloadFile = async (e) => {
    e.preventDefault();
    if (!filename) {
      setMessage('Please enter a filename to download.');
      return;
    }

    try {
      const response = await axios.get(`http://192.168.46.254:5006/download`, {
        params: { filename },
        responseType: 'blob',
      });

      // Create a URL for downloading
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      setMessage(`File "${filename}" downloaded successfully!`);
    } catch (error) {
      setMessage('Error downloading file: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Pi File Manager</h1>

        <form onSubmit={uploadFile} className="mb-8">
          <div className="mb-6">
            <label className="block text-lg text-white-700 font-medium mb-3">Upload File</label>
            <input
              type="file"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white text-lg font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Upload File
          </button>
        </form>

        <form onSubmit={downloadFile} className="mb-8">
          <div className="mb-6">
            <label className="block text-lg text-gray-700 font-medium mb-3">Download File</label>
            <input
              type="text"
              value={filename}
              onChange={handleFilenameChange}
              placeholder="Enter filename to download"
              required
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-green-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white text-lg font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            Download File
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 rounded-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUpload;
