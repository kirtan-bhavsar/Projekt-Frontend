import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});
  const [editingTask, setEditingTask] = useState(null); 
  const [editData, setEditData] = useState({ title: "", dueDate: "", assignedTo: "" });

  const fetchProjects = async () => {
    try {
      const res = await api.get("/pm/projects");
      setProjects(res.data.projects);
    } catch (error) {
      toast.error("Failed to load projects");
    }
  };

  const fetchDevelopers = async () => {
    try {
      const res = await api.get("/pm/users");
      setDevelopers(res.data.users);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await api.get(`/pm/projects/${projectId}/tasks`);
      setTasks((prev) => ({ ...prev, [projectId]: res.data.tasks }));
    } catch (error) {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, []);

  const handleCreateTask = async (e, projectId) => {
    e.preventDefault();
    const taskData = newTask[projectId];

    if (!taskData?.title || !taskData?.dueDate || !taskData?.assignedTo) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await api.post(`/pm/projects/${projectId}/tasks`, taskData);
      toast.success("Task created successfully!");
      fetchTasks(projectId);
      setNewTask((prev) => ({
        ...prev,
        [projectId]: { title: "", dueDate: "", assignedTo: "" },
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating task");
    }
  };

  const handleDeleteTask = async (taskId, projectId, status) => {
    if (status === "ongoing") {
      toast.error("Cannot delete an ongoing task");
      return;
    }

    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/pm/tasks/${taskId}`);
      toast.success("Task deleted!");
      fetchTasks(projectId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting task");
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task._id);
    setEditData({
      title: task.title,
      dueDate: task.dueDate?.split("T")[0],
      assignedTo: task.assignedTo?._id,
    });
  };

  const handleSaveEdit = async (taskId, projectId) => {
    try {
      await api.put(`/pm/tasks/${taskId}`, editData);
      toast.success("Task updated successfully!");
      setEditingTask(null);
      setEditData({ title: "", dueDate: "", assignedTo: "" });
      fetchTasks(projectId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating task");
    }
  };

  const toggleExpand = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));

    if (!expandedProjects[projectId]) fetchTasks(projectId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">My Projects</h1>
      
      </div>

      {projects.map((proj) => (
        <div
          key={proj._id}
          className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200"
        >
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-1">{proj.title}</h2>
              <p className="text-gray-600">{proj.description}</p>
            </div>

            <button
              onClick={() => toggleExpand(proj._id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {expandedProjects[proj._id] ? "▲ Collapse" : "▼ Expand"}
            </button>
          </div>

          
          {expandedProjects[proj._id] && (
            <div className="mt-4 border-t pt-4 transition-all duration-200 ease-in-out">
              
              <form
                onSubmit={(e) => handleCreateTask(e, proj._id)}
                className="mb-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={newTask[proj._id]?.title || ""}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        [proj._id]: {
                          ...newTask[proj._id],
                          title: e.target.value,
                        },
                      })
                    }
                    className="border px-3 py-2 rounded-md"
                    required
                  />

                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={newTask[proj._id]?.dueDate || ""}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        [proj._id]: {
                          ...newTask[proj._id],
                          dueDate: e.target.value,
                        },
                      })
                    }
                    className="border px-3 py-2 rounded-md"
                    required
                  />

                  <select
                    value={newTask[proj._id]?.assignedTo || ""}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        [proj._id]: {
                          ...newTask[proj._id],
                          assignedTo: e.target.value,
                        },
                      })
                    }
                    className="border px-3 py-2 rounded-md"
                    required
                  >
                    <option value="">Assign Developer / PM</option>
                    {developers.map((dev) => (
                      <option key={dev._id} value={dev._id}>
                        {dev.name} ({dev.role})
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Create Task
                  </button>
                </div>
              </form>

              {tasks[proj._id] && tasks[proj._id].length > 0 ? (
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2">Title</th>
                      <th className="p-2">Assigned To</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Due Date</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks[proj._id].map((t) => (
                      <tr key={t._id} className="border-t">
                        
                        {editingTask === t._id ? (
                          <>
                            <td className="p-2">
                              <input
                                type="text"
                                value={editData.title}
                                onChange={(e) =>
                                  setEditData({ ...editData, title: e.target.value })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              />
                            </td>

                            <td className="p-2">
                              <select
                                value={editData.assignedTo}
                                onChange={(e) =>
                                  setEditData({ ...editData, assignedTo: e.target.value })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              >
                                <option value="">Select</option>
                                {developers.map((dev) => (
                                  <option key={dev._id} value={dev._id}>
                                    {dev.name} ({dev.role})
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="p-2 capitalize">{t.status}</td>

                            <td className="p-2">
                              <input
                                type="date"
                                value={editData.dueDate}
                                onChange={(e) =>
                                  setEditData({ ...editData, dueDate: e.target.value })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              />
                            </td>

                            <td className="p-2 flex gap-2">
                              <button
                                onClick={() => handleSaveEdit(t._id, proj._id)}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingTask(null)}
                                className="text-gray-500 hover:text-gray-700 text-sm"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-2">{t.title}</td>
                            <td className="p-2">{t.assignedTo?.name}</td>
                            <td className="p-2 capitalize">{t.status}</td>
                            <td
                              className={`p-2 ${
                                new Date(t.dueDate) < new Date()
                                  ? "text-red-600"
                                  : ""
                              }`}
                            >
                              {t.dueDate?.split("T")[0]}
                            </td>
                            <td className="p-2 flex gap-3">
                              <button
                                onClick={() => handleEditClick(t)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteTask(t._id, proj._id, t.status)
                                }
                                className={`text-red-600 hover:text-red-800 text-sm ${
                                  t.status === "ongoing"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={t.status === "ongoing"}
                              >
                                Delete
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No tasks yet.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyProjects;
