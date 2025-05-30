import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function UserListPage({ onViewUserDetails }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importAll, setImportAll] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/plex/users");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/v1/plex/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      // Close modal and refresh user list
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalUsers = users.length;

  return (
    <div className="bg-[#2d3436] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Plex Users ({totalUsers})</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchUsers}
            className="bg-[#4b6bfb] hover:bg-[#3b5beb] text-white py-2 px-4 rounded-lg transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Import Users
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2.5 bg-[#3a4149] border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="loader animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-900 text-white p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#1e272e]">
              <tr>
                <th
                  onClick={() => handleSort("username")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                >
                  User{" "}
                  {sortConfig.key === "username" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                >
                  Email{" "}
                  {sortConfig.key === "email" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("is_admin")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                >
                  Admin{" "}
                  {sortConfig.key === "is_admin" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("has_access")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                >
                  Access{" "}
                  {sortConfig.key === "has_access" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("created_at")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                >
                  Created{" "}
                  {sortConfig.key === "created_at" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#2d3436] divide-y divide-gray-700">
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#3a4149]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        <button
                          onClick={() => onViewUserDetails(user.id)}
                          className="text-[#4b6bfb] hover:text-blue-400 hover:underline focus:outline-none"
                        >
                          {user.username}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {user.is_admin ? (
                          <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs">
                            Admin
                          </span>
                        ) : (
                          <span className="bg-gray-700/30 text-gray-400 px-2 py-1 rounded-full text-xs">
                            User
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {user.has_access ? (
                          <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs flex items-center justify-center w-6 h-6">
                            ✓
                          </span>
                        ) : (
                          <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded-full text-xs flex items-center justify-center w-6 h-6">
                            ✗
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!user.is_admin && (
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    {searchTerm
                      ? "No users matching your search"
                      : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2d3436] rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Confirm User Deletion
            </h3>
            <p className="mb-6 text-gray-300">
              Are you sure you want to delete user{" "}
              <span className="font-semibold">{userToDelete.username}</span>?
              This action cannot be undone.
            </p>
            {deleteError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-900 text-red-400 rounded-lg">
                {deleteError}
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Users Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2d3436] rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Confirm Import
            </h3>
            <p className="mb-6 text-gray-300">
              Do you want to import all users? Check the box below to confirm.
            </p>
            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                id="importAll"
                checked={importAll}
                onChange={(e) => setImportAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="importAll" className="text-sm text-gray-300">
                Import All Users
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch("/api/v1/plex/users/import", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ import_all: importAll }),
                    });
                    if (!response.ok) {
                      throw new Error("Failed to import users");
                    }
                    toast.success("Users imported successfully!");
                    fetchUsers(); // Refresh the user list
                  } catch (err) {
                    console.error("Error importing users:", err);
                    toast.error("Error importing users: " + err.message);
                  } finally {
                    setIsModalOpen(false);
                  }
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserListPage;
