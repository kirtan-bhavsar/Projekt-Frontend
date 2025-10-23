import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pmList, setPmList] = useState([]);
  const [selectedPm, setSelectedPm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/admin/projects");
      setProjects(res.data.projects);
    } catch (error) {
      toast.error("Failed to load projects");
    }
  };

  const fetchPMs = async () => {
    try {
      const res = await api.get("/admin/users");
      setPmList(res.data.users.filter((user) => user.role === "pm"));
    } catch (error) {
      toast.error("Failed to load Project Managers");
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchPMs();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/projects", {
        title,
        description,
        ownerId: selectedPm,
      });
      toast.success("Project created successfully!");
      setTitle("");
      setDescription("");
      setSelectedPm("");
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating project");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await api.delete(`/admin/projects/${id}`);
        toast.success("Project deleted!");
        fetchProjects();
      } catch (error) {
        toast.error("Error deleting project");
      }
    }
  };

  const handleSaveTitle = async (id) => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      await api.put(`/admin/projects/${id}`, { title: editTitle.trim() });
      toast.success("Project title updated!");
      setEditingId(null);
      setEditTitle("");
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update title");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Manage Projects</h1>
      </div>

      <form
        onSubmit={handleCreateProject}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 rounded-md"
            required
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />

          <select
            value={selectedPm}
            onChange={(e) => setSelectedPm(e.target.value)}
            className="border px-3 py-2 rounded-md"
            required
          >
            <option value="">Assign Project Manager</option>
            {pmList.map((pm) => (
              <option key={pm._id} value={pm._id}>
                {pm.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Project
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">All Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">PM</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {editingId === proj._id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border px-2 py-1 rounded-md w-44"
                      />
                    ) : (
                      <span>{proj.title}</span>
                    )}
                  </td>

                  <td className="p-3">{proj.owner?.name || "Unassigned"}</td>
                  <td className="p-3 capitalize">{proj.status}</td>

                  <td className="p-3 flex gap-3">
                    {editingId === proj._id ? (
                      <>
                        <button
                          onClick={() => handleSaveTitle(proj._id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditTitle("");
                          }}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(proj._id);
                            setEditTitle(proj.title);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(proj._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;
