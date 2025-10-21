import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ menuItems }) => {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 fixed left-0 top-0">
      <h1 className="text-2xl font-bold mb-8 text-center text-blue-400">Projekt</h1>

      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`p-2 rounded-md transition duration-200 ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
