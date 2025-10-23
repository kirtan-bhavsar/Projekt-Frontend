import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DevLayout = () => {
  const menuItems = [
    { label: "Dashboard", path: "/developer/dashboard" },
    { label: "My Tasks", path: "/developer/tasks" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar menuItems={menuItems} />
      <div className="ml-64 flex-1 flex flex-col bg-purple-50 min-h-screen">
        <Navbar />
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DevLayout;
