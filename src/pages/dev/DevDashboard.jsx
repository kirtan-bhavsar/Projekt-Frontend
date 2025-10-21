import { useEffect, useState } from "react";
import api from "../../api/axios";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981"]; // Pending - blue, Ongoing - orange, Completed - green

const DevDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/dev/tasks");
        setTasks(res.data.tasks);
      } catch (error) {
        console.error("Error fetching developer tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading tasks...</p>;

  const pending = tasks.filter((t) => t.status === "pending").length;
  const ongoing = tasks.filter((t) => t.status === "ongoing").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  const data = [
    { name: "Pending", value: pending },
    { name: "Ongoing", value: ongoing },
    { name: "Completed", value: completed },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Developer Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Task Overview</h2>

        {tasks.length === 0 ? (
          <p>No tasks assigned to you yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DevDashboard;
