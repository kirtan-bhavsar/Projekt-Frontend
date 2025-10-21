import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const PMLayout = () => {
  const menuItems = [
    { label: "Dashboard", path: "/pm/dashboard" },
    { label: "My Projects", path: "/pm/projects" },
    { label: "My Tasks", path: "/pm/tasks" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar menuItems={menuItems} />

      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col bg-green-50 min-h-screen">
        <Navbar />
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PMLayout;
