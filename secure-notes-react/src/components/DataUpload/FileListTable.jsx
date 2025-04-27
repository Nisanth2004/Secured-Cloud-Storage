import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import axios from "axios";
import { useTable } from "react-table";

const FileListTable = () => {
  const { currentUser } = useMyContext();
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
        `${SERVER_IP}/list-files/user/${currentUser.username}`
      );
      setFileList(response.data.files);
    } catch (error) {
      toast.error("Error fetching file list");
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(
        `${SERVER_IP}/delete/${currentUser.username}/${filename}`
      );
      toast.success("File deleted successfully!");
      fetchFileList(); // Refresh the list
    } catch (error) {
      toast.error("Error deleting file");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "File Name",
        accessor: "filename",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.original.filename)}
            className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105"
          >
             Delete
          </button>
        ),
      },
    ],
    []
  );

  const data = useMemo(
    () => fileList.map((file) => ({ filename: file })),
    [fileList]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-300 px-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8 border border-gray-300">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          📂 My Files
        </h2>
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="w-full border-collapse shadow-lg rounded-lg overflow-hidden"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-gradient-to-r from-teal-600 to-blue-700 text-white uppercase tracking-wider"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="py-4 px-6 text-left border-b border-gray-300"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                      } hover:bg-yellow-300 transition-all`}
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="py-3 px-6 border-b border-gray-300 text-gray-900 text-lg"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-5 text-center text-gray-500 text-lg"
                  >
                    No files found 📭
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileListTable;
