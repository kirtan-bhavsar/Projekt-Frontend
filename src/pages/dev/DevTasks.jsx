import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const DevTasks = () => {
  const [tasks, setTasks] = useState({ pending: [], ongoing: [], completed: [] });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/dev/tasks");
      console.log(res);
      console.log("res---fromDevTasks.jsx");
      console.log("res---fromDevTasks.jsx");
      const allTasks = res.data.tasks;

      setTasks({
        pending: allTasks.filter((t) => t.status === "pending"),
        ongoing: allTasks.filter((t) => t.status === "ongoing"),
        completed: allTasks.filter((t) => t.status === "completed"),
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const movedTask = tasks[sourceCol][source.index];

    // Update local state
    const updatedSource = [...tasks[sourceCol]];
    updatedSource.splice(source.index, 1);
    const updatedDest = [...tasks[destCol]];
    updatedDest.splice(destination.index, 0, movedTask);

    const newTasks = { ...tasks, [sourceCol]: updatedSource, [destCol]: updatedDest };
    setTasks(newTasks);

    try {
      await api.put(`/dev/tasks/${movedTask._id}`, { status: destCol });
      toast.success(`Task moved to ${destCol}`);
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const columns = [
    { id: "pending", title: "Pending", color: "bg-blue-100" },
    { id: "ongoing", title: "Ongoing", color: "bg-yellow-100" },
    { id: "completed", title: "Completed", color: "bg-green-100" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-700">My Tasks (Kanban Board)</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-4 rounded-lg shadow-md ${col.color} min-h-[500px]`}
                >
                  <h2 className="text-lg font-semibold mb-4 text-center">{col.title}</h2>

                  {tasks[col.id].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-3 mb-3 rounded-md shadow-sm border-l-4 ${
                            col.id === "pending"
                              ? "border-blue-600"
                              : col.id === "ongoing"
                              ? "border-yellow-600"
                              : "border-green-600"
                          } ${snapshot.isDragging ? "opacity-80" : ""}`}
                        >
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-sm text-gray-500">
                            Due:{" "}
                            <span
                              className={`${
                                new Date(task.dueDate) < new Date() ? "text-red-600" : ""
                              }`}
                            >
                              {task.dueDate.split("T")[0]}
                            </span>
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default DevTasks;
