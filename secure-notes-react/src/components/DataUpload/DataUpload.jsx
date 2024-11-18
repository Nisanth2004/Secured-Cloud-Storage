import React, { useState } from "react";
import { FaCloudUploadAlt, FaLock, FaKey, FaWifi, FaFileAlt } from "react-icons/fa";
import { MdVpnKey } from "react-icons/md";

const DataUpload = () => {
  const [formData, setFormData] = useState({
    ipAddress: "",
    data: "",
    oldPassword: "",
    newPassword: "",
  });

  const [decryptedData, setDecryptedData] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { ipAddress, data, oldPassword, newPassword } = formData;

    const payload = `data=${data}&password=${oldPassword}&new_password=${newPassword}`;
    const url = `http://${ipAddress}/upload`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Response: " + data.status);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDecrypt = () => {
    const { ipAddress } = formData;
    const password = prompt("Enter the password to decrypt the data:");

    if (password) {
      const url = `http://${ipAddress}/decrypt?plain=${password}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "Password correct") {
            setDecryptedData(data.data);
            setShowModal(true);
          } else {
            alert(data.status);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-gray-100 rounded-xl shadow-lg p-6 text-gray-900">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">
          <FaCloudUploadAlt className="inline-block text-blue-600 mr-2" />
          Data Upload
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="ipAddress" className="block text-sm font-semibold text-gray-700 mb-1">
              <FaWifi className="inline-block mr-2" />
              IP Address
            </label>
            <div className="relative">
              <input
                type="text"
                id="ipAddress"
                name="ipAddress"
                className="w-full p-2 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter IP address"
                value={formData.ipAddress}
                onChange={handleChange}
                required
              />
              <FaWifi className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="data" className="block text-sm font-semibold text-gray-700 mb-1">
              <FaFileAlt className="inline-block mr-2" />
              Data
            </label>
            <div className="relative">
              <input
                type="text"
                id="data"
                name="data"
                className="w-full p-2 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter data"
                value={formData.data}
                onChange={handleChange}
                required
              />
              <FaFileAlt className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700 mb-1">
              <FaKey className="inline-block mr-2" />
              Previous Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                className="w-full p-2 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter old password"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
              <FaKey className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1">
              <MdVpnKey className="inline-block mr-2" />
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="w-full p-2 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <MdVpnKey className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <button
  type="submit"
  className="w-full py-2 border border-blue-600 text-blue-600 font-bold rounded-md hover:bg-blue-600 hover:text-white transition-transform transform hover:scale-105"
>
  <FaCloudUploadAlt className="mr-1" /> Upload Data
</button>
        </form>

        <button
  onClick={handleDecrypt}
  className="w-full mt-3 py-2 border border-green-600 text-green-600 font-bold rounded-md hover:bg-green-600 hover:text-white transition-transform transform hover:scale-105"
>
  <FaLock className="mr-1" /> Decrypt Data
</button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Decrypted Data
              </h2>
              <p className="text-gray-700">{decryptedData}</p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white py-2 px-4 rounded mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUpload;
