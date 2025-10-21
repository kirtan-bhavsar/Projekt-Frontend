import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [editData, setEditData] = useState({ title: "", dueDate: "", assignedTo: "" });

  // Fetch PM's assigned projects
  const fetchProjects = async () => {
    try {
      const res = await api.get("/pm/projects");
      setProjects(res.data.projects);
    } catch {
      toast.error("Failed to load projects");
    }
  };

  // Fetch developers + PM (for assignment)
  const fetchDevelopers = async () => {
    try {
      const res = await api.get("/pm/users");
      setDevelopers(res.data.users);
    } catch {
      toast.error("Failed to load users");
    }
  };

  // Fetch tasks for a project
  const fetchTasks = async (projectId) => {
    try {
      const res = await api.get(`/pm/projects/${projectId}/tasks`);
      setTasks((prev) => ({ ...prev, [projectId]: res.data.tasks }));
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, []);

  // Create new task
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

  // Edit Task - Open Modal
  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditData({
      title: task.title,
      dueDate: task.dueDate?.split("T")[0],
      assignedTo: task.assignedTo?._id || "",
    });
  };

  // Save Task Edits
  const handleSaveEdit = async () => {
    try {
      await api.put(`/pm/tasks/${editingTask._id}`, editData);
      toast.success("Task updated successfully!");
      fetchTasks(editingTask.project);
      setEditingTask(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">My Projects</h1>
      </div>

      {projects.map((proj) => (
        <div key={proj._id} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-3">{proj.title}</h2>
          <p className="text-gray-600 mb-4">{proj.description}</p>

          {/* Add Task Form */}
          <form onSubmit={(e) => handleCreateTask(e, proj._id)} className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask[proj._id]?.title || ""}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    [proj._id]: { ...newTask[proj._id], title: e.target.value },
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
                    [proj._id]: { ...newTask[proj._id], dueDate: e.target.value },
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
                    [proj._id]: { ...newTask[proj._id], assignedTo: e.target.value },
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

          {/* View Tasks */}
          <button
            onClick={() => fetchTasks(proj._id)}
            className="text-blue-600 underline text-sm mb-3"
          >
            View Tasks
          </button>

          {tasks[proj._id]?.length > 0 && (
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
                    <td className="p-2">{t.title}</td>
                    <td className="p-2">{t.assignedTo?.name}</td>
                    <td className="p-2 capitalize">{t.status}</td>
                    <td
                      className={`p-2 ${
                        new Date(t.dueDate) < new Date() ? "text-red-600" : ""
                      }`}
                    >
                      {t.dueDate?.split("T")[0]}
                    </td>
                    <td className="p-2">
                      {t.status !== "completed" && (
                        <button
                          onClick={() => handleEditTask(t)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      {/* ✏️ Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>

            <input
              type="text"
              placeholder="Title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="border px-3 py-2 rounded-md w-full mb-3"
            />

            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
              className="border px-3 py-2 rounded-md w-full mb-3"
            />

            <select
              value={editData.assignedTo}
              onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
              className="border px-3 py-2 rounded-md w-full mb-3"
            >
              <option value="">Assign To</option>
              {developers.map((dev) => (
                <option key={dev._id} value={dev._id}>
                  {dev.name} ({dev.role})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
