import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Manage Projects", path: "/admin/projects" },
    { label: "Manage Users", path: "/admin/users" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar menuItems={menuItems} />

      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col bg-gray-50 min-h-screen">
        <Navbar />
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
