"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/users/";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch {
      setError("Failed to fetch users");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}`, { name, email });
        setSuccess("User updated successfully!");
        setEditingId(null);
      } else {
        await axios.post(API_URL, { name, email });
        setSuccess("User created successfully!");
      }
      setName("");
      setEmail("");
      fetchUsers();
    } catch {
      setError("Failed to save user");
    } finally {
      setLoading(false);
    }
  }

  function editUser(user) {
    setError("");
    setSuccess("");
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_URL}${id}`);
      setSuccess("User deleted successfully!");
      fetchUsers();
    } catch {
      setError("Failed to delete user");
    }
  }

  return (
    <main className="max-w-xl mx-auto mt-10 px-4 font-sans">
      <h1 className="text-3xl font-semibold text-center mb-8">User Management</h1>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {editingId ? "Update User" : "Create User"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setEmail("");
                setError("");
                setSuccess("");
              }}
              disabled={loading}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="text-red-600 font-semibold mb-4 text-center">{error}</p>
      )}
      {success && (
        <p className="text-green-600 font-semibold mb-4 text-center">{success}</p>
      )}

      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-gray-100 rounded-md flex justify-between items-center p-4"
          >
            <div>
              <strong className="text-lg">{user.name}</strong> ({user.email})
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editUser(user)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-md transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
