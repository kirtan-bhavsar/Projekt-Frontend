import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password, role });
      toast.success("User created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Manage Users</h1>

      <form onSubmit={handleCreateUser} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2 rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 rounded-md"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-3 py-2 rounded-md"
            required
          >
            <option value="">Select Role</option>
            <option value="pm">Project Manager</option>
            <option value="developer">Developer</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create User
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        {users.length === 0 ? (
          <p>No users yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
